import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const ClothingPredictionDashboard = () => {
  // State for selected chart type
  const [chartType, setChartType] = useState('bar');
  
  // Mock sales data for previous 12 months
  const salesData = [
    { month: 'Apr', tShirts: 120, jeans: 85, dresses: 95, jackets: 60, sweaters: 30 },
    { month: 'May', tShirts: 140, jeans: 75, dresses: 115, jackets: 40, sweaters: 20 },
    { month: 'Jun', tShirts: 180, jeans: 90, dresses: 140, jackets: 20, sweaters: 15 },
    { month: 'Jul', tShirts: 200, jeans: 100, dresses: 150, jackets: 10, sweaters: 10 },
    { month: 'Aug', tShirts: 190, jeans: 110, dresses: 130, jackets: 15, sweaters: 20 },
    { month: 'Sep', tShirts: 160, jeans: 120, dresses: 110, jackets: 55, sweaters: 40 },
    { month: 'Oct', tShirts: 120, jeans: 130, dresses: 90, jackets: 110, sweaters: 70 },
    { month: 'Nov', tShirts: 90, jeans: 125, dresses: 70, jackets: 150, sweaters: 130 },
    { month: 'Dec', tShirts: 70, jeans: 120, dresses: 60, jackets: 180, sweaters: 160 },
    { month: 'Jan', tShirts: 60, jeans: 110, dresses: 50, jackets: 160, sweaters: 170 },
    { month: 'Feb', tShirts: 80, jeans: 115, dresses: 70, jackets: 140, sweaters: 150 },
    { month: 'Mar', tShirts: 110, jeans: 125, dresses: 95, jackets: 110, sweaters: 110 }
  ];

  // Predicted sales for next month (April)
  const predictedSales = {
    month: 'Apr (Predicted)',
    tShirts: 130,
    jeans: 130,
    dresses: 110,
    jackets: 90,
    sweaters: 70
  };

  // Combined data for charts
  const combinedData = [...salesData, predictedSales];

  // Prepare data for pie chart
  const pieChartData = Object.entries(predictedSales)
    .filter(([key]) => key !== 'month')
    .map(([key, value]) => ({
      name: formatCategory(key),
      value: value
    }));

  // Calculate top sellers and competitive items
  const calculateTopSellers = () => {
    const categories = ['tShirts', 'jeans', 'dresses', 'jackets', 'sweaters'];
    const topSeller = categories.reduce((max, category) => 
      predictedSales[category] > predictedSales[max] ? category : max, categories[0]);
    
    // Competitive items are within 15% of top seller
    const topSellerValue = predictedSales[topSeller];
    const competitive = categories.filter(cat => 
      cat !== topSeller && predictedSales[cat] >= topSellerValue * 0.85
    );

    return { topSeller, competitive };
  };

  const { topSeller, competitive } = calculateTopSellers();

  // Format category names for display
  function formatCategory(category) {
    const formatting = {
      tShirts: 'T-Shirts',
      jeans: 'Jeans',
      dresses: 'Dresses',
      jackets: 'Jackets',
      sweaters: 'Sweaters'
    };
    return formatting[category] || category;
  }

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  // Get color for specific category (for pie chart highlighting)
  const getCategoryColor = (categoryName) => {
    const index = ['tShirts', 'jeans', 'dresses', 'jackets', 'sweaters']
      .findIndex(cat => formatCategory(cat) === categoryName);
    return index >= 0 ? COLORS[index] : '#999';
  };

  // Render the selected chart type
  const renderChart = () => {
    switch(chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tShirts" name="T-Shirts" stroke="#3B82F6" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="jeans" name="Jeans" stroke="#10B981" />
              <Line type="monotone" dataKey="dresses" name="Dresses" stroke="#F59E0B" />
              <Line type="monotone" dataKey="jackets" name="Jackets" stroke="#EF4444" />
              <Line type="monotone" dataKey="sweaters" name="Sweaters" stroke="#8B5CF6" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={combinedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tShirts" name="T-Shirts" fill="#3B82F6" />
              <Bar dataKey="jeans" name="Jeans" fill="#10B981" />
              <Bar dataKey="dresses" name="Dresses" fill="#F59E0B" />
              <Bar dataKey="jackets" name="Jackets" fill="#EF4444" />
              <Bar dataKey="sweaters" name="Sweaters" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getCategoryColor(entry.name)}
                    stroke={entry.name === formatCategory(topSeller) ? "#000" : "none"}
                    strokeWidth={entry.name === formatCategory(topSeller) ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} units`, `Predicted Sales`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Please select a chart type</div>;
    }
  };

  // Logout function (would connect to your auth system)
  const handleLogout = () => {
    // In a real app, would clear authentication state/tokens
    console.log('Logging out...');
    // Redirect to login page or trigger auth state change
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">FashionTrend Admin</h1>
          <button 
            onClick={handleLogout}
            className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800 transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sales Prediction Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Based on analysis of the last 12 months of sales data, here are the predicted sales trends for April 2025.
          </p>

          {/* Chart Type Selection */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-gray-700 font-medium mr-2">Chart Type:</span>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-1 rounded ${chartType === 'bar' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-1 rounded ${chartType === 'line' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-4 py-1 rounded ${chartType === 'pie' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Pie Chart
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {chartType === 'pie' 
                ? 'Predicted Sales Distribution for April' 
                : '12-Month Sales History + Prediction'}
            </h3>
            <div className="h-96">
              {renderChart()}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">Predicted Top Seller for April</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-indigo-800">{formatCategory(topSeller)}</span>
                <span className="ml-3 bg-indigo-200 text-indigo-800 px-2 py-1 rounded text-sm">
                  {predictedSales[topSeller]} units
                </span>
              </div>
              
              {/* Growth indicator */}
              <div className="mt-3">
                {(() => {
                  const previousMonth = salesData[salesData.length - 1][topSeller];
                  const growth = ((predictedSales[topSeller] - previousMonth) / previousMonth * 100).toFixed(1);
                  const isPositive = growth >= 0;
                  return (
                    <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="font-medium">{isPositive ? '↑' : '↓'} {Math.abs(growth)}%</span>
                      <span className="ml-2 text-sm">vs. Previous Month</span>
                    </div>
                  );
                })()}
              </div>
              
              <p className="mt-4 text-indigo-600">
                {formatCategory(topSeller)} are predicted to be your best-selling item next month based on historical trends and seasonality patterns.
              </p>
              <div className="mt-4 flex space-x-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  Trending Up
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  High Margin
                </span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-700 mb-2">Competitive Items</h3>
              {competitive.length > 0 ? (
                <div>
                  <p className="text-amber-600 mb-4">
                    These items are within 15% of your top seller and should be featured prominently:
                  </p>
                  <ul className="space-y-3">
                    {competitive.map((item) => {
                      // Calculate percentage compared to top seller
                      const topSellerValue = predictedSales[topSeller];
                      const itemValue = predictedSales[item];
                      const percentOfTopSeller = Math.round((itemValue / topSellerValue) * 100);
                      
                      return (
                        <li key={item} className="border-b pb-2 border-amber-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-amber-800">{formatCategory(item)}</span>
                            <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-sm">
                              {predictedSales[item]} units
                            </span>
                          </div>
                          
                          {/* Progress bar showing comparison to top seller */}
                          <div className="mt-2">
                            <div className="w-full bg-amber-100 rounded-full h-2">
                              <div 
                                className="bg-amber-500 h-2 rounded-full" 
                                style={{ width: `${percentOfTopSeller}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-amber-700 mt-1 text-right">
                              {percentOfTopSeller}% of top seller
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="text-amber-600">
                  No competitive items found. {formatCategory(topSeller)} are predicted to significantly outperform other categories.
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recommended Actions</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded mr-2">✓</span>
                <span>Increase inventory of {formatCategory(topSeller)} by 15% to prepare for projected demand</span>
              </li>
              {competitive.length > 0 && (
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 p-1 rounded mr-2">✓</span>
                  <span>Feature {competitive.map(item => formatCategory(item)).join(' and ')} in homepage promotions</span>
                </li>
              )}
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded mr-2">✓</span>
                <span>Create bundle offers combining {formatCategory(topSeller)} with complementary items</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded mr-2">✓</span>
                <span>Reduce marketing spend on lowest-performing categories and reallocate to top performers</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-sm text-gray-500 text-center">
          <p>Last updated: March 23, 2025 | Next prediction update: April 1, 2025</p>
          <p>This prediction is based on historical sales data and may not account for external market factors.</p>
        </div>
      </div>
    </div>
  );
};

export default ClothingPredictionDashboard;