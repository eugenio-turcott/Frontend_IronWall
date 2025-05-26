export function generateForecast(data, windowSize = 3, monthsToPredict = 3) {
  const forecast = [...data];
  const values = data.map(d => d.pv);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let lastMonthIndex = monthNames.indexOf(data[data.length - 1]?.name || "May");

  for (let i = 0; i < monthsToPredict; i++) {
    const recentValues = values.slice(-windowSize);
    const avg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    values.push(avg); // necesario para la próxima iteración
    forecast.push({
      name: monthNames[(lastMonthIndex + i + 1) % 12],
      pv: avg,
      forecast: true
    });
  }

  console.log("Forecast (Moving Average):", forecast);
  return forecast;
}