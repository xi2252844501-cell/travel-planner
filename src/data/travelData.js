import travelData from './travelData.json';

export const cities = travelData.cities;
export const departures = travelData.departures;
export const trafficPrices = travelData.trafficPrices;
export const seasonFactors = travelData.seasonFactors;
export const attractionsData = travelData.attractionsData;
export const hotelsData = travelData.hotelsData;
export const itineraryTemplates = travelData.itineraryTemplates;
export const packingListData = travelData.packingListData;
export const destinationIntroData = travelData.destinationIntroData;
export const cityCoordinates = travelData.cityCoordinates;

// 计算两点间的大圆距离（公里）
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球半径 km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 动态交通票价估算模型
export function getTrafficPrices(departure, destination) {
  const depCoord = cityCoordinates[departure];
  // 目的地坐标，如目的地不存在，尝试从地级市中找坐标，最后兜底三亚
  const destCoord = cityCoordinates[destination] || cityCoordinates['三亚'];

  if (!depCoord || !destCoord) {
    return { flight: null, trainG: null, trainS: null };
  }

  const distance = getDistance(depCoord.y, depCoord.x, destCoord.y, destCoord.x);

  // 1. 飞机经济舱 (单程基价)：两地距离 > 600km 时提供
  const flight = distance > 600 ? Math.round(distance * 0.45 + 150) : null;

  // 2. 高铁二等座 (单程基价)：距离在 100km ~ 2000km 之间提供
  const trainG = (distance > 100 && distance < 2000) ? Math.round(distance * 0.48) : null;

  // 3. 普通列车卧铺 (单程基价)：距离 > 100km 时提供
  const trainS = distance > 100 ? Math.round(distance * 0.24) : null;

  return { flight, trainG, trainS };
}
