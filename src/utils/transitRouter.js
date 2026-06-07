// 城市景点公共交通信息元数据
export const transitMeta = {
  // 北京
  gugong: { name: "故宫博物院", station: "天安门东站", exit: "B口", lines: ["地铁1号线八通线"], busStop: "故宫站", busLines: ["专1路", "专2路"], zone: 1 },
  tiantan: { name: "天坛公园", station: "天坛东门站", exit: "A口", lines: ["地铁5号线"], busStop: "天坛东门站", busLines: ["36路", "54路", "120路"], zone: 3 },
  yiheyuan: { name: "颐和园", station: "北宫门站", exit: "D口", lines: ["地铁4号线大兴线"], busStop: "颐和园北宫门站", busLines: ["303路", "346路", "384路"], zone: 5 },
  universal: { name: "北京环球影城", station: "环球度假区站", exit: "B口", lines: ["地铁7号线", "地铁1号线八通线"], busStop: "环球度假区站", busLines: ["589路", "T116路"], zone: 6 },
  badaling: { name: "八达岭长城", station: "八达岭长城站", exit: "", lines: ["市郊铁路S2线"], busStop: "八达岭长城站", busLines: ["877路长城专线"], zone: 7 },
  sanlitun: { name: "三里屯太古里", station: "团结湖站", exit: "D口", lines: ["地铁10号线"], busStop: "三里屯站", busLines: ["113路", "115路", "406路"], zone: 4 },
  tiananmen: { name: "天安门广场", station: "天安门东站", exit: "A口", lines: ["地铁1号线八通线"], busStop: "天安门东站", busLines: ["1路", "52路", "120路"], zone: 1 },
  jingshan: { name: "景山公园", station: "东四站", exit: "B口", lines: ["地铁8号线", "地铁5号线"], busStop: "景山东门站", busLines: ["111路", "124路", "58路"], zone: 1 },
  nanluoguxiang: { name: "南锣鼓巷与什刹海", station: "南锣鼓巷站", exit: "E口", lines: ["地铁6号线", "地铁8号线"], busStop: "锣鼓巷站", busLines: ["3路", "13路", "118路"], zone: 2 },
  gongwangfu: { name: "恭王府", station: "北海北站", exit: "B口", lines: ["地铁6号线"], busStop: "北海北门站", busLines: ["3路", "13路", "111路"], zone: 2 },

  // 三亚
  yemeng: { name: "椰梦长廊", station: null, lines: [], busStop: "美丽新海岸站", busLines: ["8路", "25路", "26路"], zone: 1 },
  xidao: { name: "西岛", station: null, lines: [], busStop: "肖旗港陆岛交通码头站", busLines: ["25路", "26路", "55路"], zone: 1 },
  nanshan: { name: "南山文化旅游区", station: null, lines: [], busStop: "南山景区站", busLines: ["55路", "25路快线"], zone: 6 },
  dadonghai: { name: "大东海旅游区", station: null, lines: [], busStop: "大东海广场站", busLines: ["4路", "8路", "15路", "25路"], zone: 2 },
  luhuitou: { name: "鹿回头风景区", station: null, lines: [], busStop: "鹿回头景区站", busLines: ["26路", "55路", "微3路"], zone: 2 },
  qianguqing: { name: "三亚千古情", station: null, lines: [], busStop: "三亚千古情站", busLines: ["1路", "7路", "9路", "27路"], zone: 3 },
  xiaodonghai: { name: "小东海", station: null, lines: [], busStop: "半山半岛站", busLines: ["微3路"], zone: 2 },
  yalongbay_forest: { name: "亚龙湾热带天堂森林公园", station: null, lines: [], busStop: "亚龙湾森林公园站", busLines: ["15路", "24路", "27路"], zone: 4 },
  taiyangwan: { name: "太阳湾", station: null, lines: [], busStop: "太阳湾站", busLines: ["亚龙湾观光巴士"], zone: 4 },
  wuzhizhou: { name: "蜈支洲岛度假区", station: null, lines: [], busStop: "蜈支洲岛码头站", busLines: ["28路", "33路", "海棠湾3路"], zone: 5 },
  atlantis_water: { name: "三亚亚特兰蒂斯度假区", station: null, lines: [], busStop: "亚特兰蒂斯水世界站", busLines: ["33路", "34路", "35路"], zone: 5 },
  dutyfree: { name: "三亚国际免税城", station: null, lines: [], busStop: "三亚国际免税城站", busLines: ["33路", "34路", "35路"], zone: 5 },
  houhai: { name: "后海村 (冲浪胜地)", station: null, lines: [], busStop: "藤海小学站", busLines: ["28路", "33路", "海棠湾3路"], zone: 5 },

  // 成都
  pandas: { name: "成都大熊猫繁育研究基地", station: "军区总医院站", exit: "B口", lines: ["地铁3号线"], busStop: "熊猫基地站", busLines: ["D025路接驳车"], zone: 5 },
  kuanzhai: { name: "宽窄巷子", station: "宽窄巷子站", exit: "B口", lines: ["地铁4号线"], busStop: "宽窄巷子站", busLines: ["62路", "70路", "93路"], zone: 1 },
  dufu: { name: "杜甫草堂", station: "草堂北路站", exit: "B口", lines: ["地铁4号线"], busStop: "杜甫草堂站", busLines: ["19路", "82路", "1024路"], zone: 1 },
  jinli: { name: "锦里古街", station: "高升桥站", exit: "D口", lines: ["地铁3号线", "地铁5号线"], busStop: "武侯祠站", busLines: ["1路", "57路", "82路", "334路"], zone: 2 },
  taikooli: { name: "春熙路与太古里", station: "春熙路站", exit: "C口", lines: ["地铁2号线", "地铁3号线"], busStop: "春熙路站", busLines: ["58路", "98路"], zone: 3 },
  wuhou: { name: "武侯祠", station: "高升桥站", exit: "D口", lines: ["地铁3号线", "地铁5号线"], busStop: "武侯祠站", busLines: ["1路", "57路", "82路", "334路"], zone: 2 },
  peoplespark: { name: "人民公园", station: "人民公园站", exit: "B口", lines: ["地铁2号线"], busStop: "人民公园站", busLines: ["5路", "13路", "78路"], zone: 1 },
  dujiangyan: { name: "都江堰景区", station: "都江堰站", exit: "", lines: ["成灌铁路城际动车"], busStop: "都江堰景区站", busLines: ["101路"], zone: 6 },
  qingcheng: { name: "青城山", station: "青城山站", exit: "", lines: ["成灌铁路城际动车"], busStop: "青城山站", busLines: ["景区接驳车"], zone: 6 },
  jinsha: { name: "金沙遗址博物馆", station: "金沙博物馆站", exit: "C口", lines: ["地铁7号线"], busStop: "金沙遗址东门站", busLines: ["82路", "83路", "163路"], zone: 2 }
};

// 获取北京地铁换乘车站
const getTransferStation = (line1, line2) => {
  const l1 = line1.replace('大兴线', '').replace('八通线', '');
  const l2 = line2.replace('大兴线', '').replace('八通线', '');
  
  const key = [l1, l2].sort().join('-');
  const transfers = {
    '地铁1号线-地铁4号线': '西单站',
    '地铁1号线-地铁5号线': '东单站',
    '地铁1号线-地铁6号线': '东四站',
    '地铁1号线-地铁7号线': '双井站',
    '地铁1号线-地铁8号线': '王府井站',
    '地铁1号线-地铁10号线': '国贸站',
    '地铁4号线-地铁5号线': '宣武门站/宋家庄站',
    '地铁4号线-地铁6号线': '平安里站',
    '地铁4号线-地铁7号线': '北京西站',
    '地铁4号线-地铁8号线': '鼓楼大街站',
    '地铁4号线-地铁10号线': '海淀黄庄站',
    '地铁5号线-地铁6号线': '东四站',
    '地铁5号线-地铁7号线': '磁器口站',
    '地铁5号线-地铁8号线': '鼓楼大街站',
    '地铁5号线-地铁10号线': '惠新西街南口站',
    '地铁6号线-地铁7号线': '慈寿寺站/双井站',
    '地铁6号线-地铁8号线': '南锣鼓巷站',
    '地铁6号线-地铁10号线': '呼家楼站',
    '地铁7号线-地铁8号线': '珠市口站',
    '地铁7号线-地铁10号线': '双井站',
    '地铁8号线-地铁10号线': '北土城站'
  };
  return transfers[key] || '市中心换乘站';
};

// 获取成都地铁换乘车站
const getChengduTransfer = (line1, line2) => {
  const key = [line1, line2].sort().join('-');
  const transfers = {
    '地铁2号线-地铁3号线': '春熙路站',
    '地铁2号线-地铁4号线': '中医大省医院站',
    '地铁2号线-地铁5号线': '中医大省医院站',
    '地铁2号线-地铁7号线': '一品天下站',
    '地铁3号线-地铁4号线': '市二医院站',
    '地铁3号线-地铁5号线': '高升桥站',
    '地铁3号线-地铁7号线': '驷马桥站',
    '地铁4号线-地铁5号线': '中医大省医院站',
    '地铁4号线-地铁7号线': '文化宫站',
    '地铁5号线-地铁7号线': '神仙树站'
  };
  return transfers[key] || '天府广场站';
};

// 根据所选酒店的行政区与商圈信息，动态推导匹配最近的公共交通站信息
export const getHotelTransitMeta = (hotel, destination) => {
  if (!hotel) return null;
  const area = hotel.area || '';
  const subarea = hotel.subarea || '';

  if (destination === '北京') {
    if (area.includes('东城') || subarea.includes('王府井')) {
      return { station: "王府井站", exit: "A口", lines: ["地铁1号线八通线"], busStop: "王府井站", busLines: ["1路", "52路"], zone: 1 };
    }
    if (area.includes('朝阳') || subarea.includes('三里屯') || subarea.includes('使馆区') || subarea.includes('亮马河')) {
      return { station: "团结湖站", exit: "D口", lines: ["地铁10号线"], busStop: "三里屯站", busLines: ["113路", "115路"], zone: 4 };
    }
    if (area.includes('西城') || subarea.includes('什刹海') || subarea.includes('鼓楼') || subarea.includes('后海')) {
      return { station: "北海北站", exit: "B口", lines: ["地铁6号线"], busStop: "北海北门站", busLines: ["3路", "13路"], zone: 2 };
    }
    if (area.includes('海淀') || subarea.includes('颐和园')) {
      return { station: "北宫门站", exit: "A口", lines: ["地铁4号线大兴线"], busStop: "颐和园站", busLines: ["303路", "346路"], zone: 5 };
    }
    if (area.includes('通州') || subarea.includes('环球影城')) {
      return { station: "环球度假区站", exit: "B口", lines: ["地铁7号线", "地铁1号线八通线"], busStop: "环球度假区站", busLines: ["589路"], zone: 6 };
    }
    return { station: "东单站", exit: "A口", lines: ["地铁1号线八通线"], busStop: "东单站", busLines: ["1路"], zone: 1 };
  }

  if (destination === '成都') {
    if (area.includes('锦江') || subarea.includes('春熙路') || subarea.includes('太古里') || subarea.includes('九眼桥')) {
      return { station: "春熙路站", exit: "C口", lines: ["地铁2号线", "地铁3号线"], busStop: "春熙路站", busLines: ["58路"], zone: 3 };
    }
    if (area.includes('青羊') || subarea.includes('宽窄巷子') || subarea.includes('人民公园') || subarea.includes('天府广场')) {
      return { station: "宽窄巷子站", exit: "B口", lines: ["地铁4号线"], busStop: "宽窄巷子站", busLines: ["62路"], zone: 1 };
    }
    if (area.includes('武侯') || subarea.includes('武侯祠') || subarea.includes('玉林') || subarea.includes('双流')) {
      return { station: "高升桥站", exit: "D口", lines: ["地铁3号线", "地铁5号线"], busStop: "武侯祠站", busLines: ["1路", "57路"], zone: 2 };
    }
    if (area.includes('金牛') || subarea.includes('金沙遗址') || subarea.includes('茶店子')) {
      return { station: "金沙博物馆站", exit: "C口", lines: ["地铁7号线"], busStop: "金沙遗址东门站", busLines: ["82路"], zone: 2 };
    }
    return { station: "天府广场站", exit: "A口", lines: ["地铁2号线"], busStop: "天府广场站", busLines: ["16路"], zone: 1 };
  }

  if (destination === '三亚') {
    if (area.includes('三亚湾') || subarea.includes('三亚湾') || area.includes('天涯')) {
      return { station: null, lines: [], busStop: "美丽新海岸站", busLines: ["8路", "25路", "26路"], zone: 1 };
    }
    if (area.includes('大东海') || subarea.includes('大东海') || area.includes('吉阳') || subarea.includes('鹿回头')) {
      return { station: null, lines: [], busStop: "大东海广场站", busLines: ["4路", "8路", "15路", "25路"], zone: 2 };
    }
    if (area.includes('亚龙湾') || subarea.includes('亚龙湾')) {
      return { station: null, lines: [], busStop: "亚龙湾森林公园站", busLines: ["15路", "24路", "27路"], zone: 4 };
    }
    if (area.includes('海棠湾') || subarea.includes('海棠湾') || subarea.includes('后海')) {
      return { station: null, lines: [], busStop: "三亚国际免税城站", busLines: ["33路", "34路", "35路"], zone: 5 };
    }
    return { station: null, lines: [], busStop: "大东海广场站", busLines: ["8路", "25路"], zone: 2 };
  }

  return null;
};

// 基础的通用交通路线推荐引擎，直接处理两个端点 Meta 的属性
export const getTransitAdviceCustom = (destination, m1, m2, spot1Id = '', spot2Id = '') => {
  if (!m1 || !m2) return null;

  // 1. 步行或极度邻近
  const walkingPairs = {
    'tiananmen-gugong': {
      icon: '🚶',
      text: '步行直达：从天安门广场向北穿过端门，即可抵达故宫午门入口，步行约 800米 (用时 ~10分钟)',
      tip: '贴士：故宫必须由天安门侧午门进入，单向参观，别走错了！'
    },
    'gugong-jingshan': {
      icon: '🚶',
      text: '步行直达：从故宫神武门出，过马路对面即是景山公园南门，步行约 150米 (用时 ~2分钟)',
      tip: '贴士：出故宫顺路登景山万春亭俯瞰故宫全貌，日落时分景色极美。'
    },
    'nanluoguxiang-gongwangfu': {
      icon: '🚶',
      text: '步行推荐/地铁：穿过什刹海胡同区直接步行约 1.2公里 (用时 ~15分钟)；亦可在南锣鼓巷站乘坐地铁6号线至北海北站 (用时 ~8分钟)',
      tip: '贴士：沿途能欣赏什刹海的垂柳与特色胡同，强烈建议步行骑行！'
    },
    'wuhou-jinli': {
      icon: '🚶',
      text: '步行直达：武侯祠与锦里古街紧邻，锦里即是武侯祠的商业街区，无需交通工具，步行 1分钟即达',
      tip: '贴士：白天逛武侯祠感受三国文化，傍晚直接从侧门步入锦里欣赏红灯笼夜景。'
    },
    'kuanzhai-peoplespark': {
      icon: '🚶',
      text: '步行直达：从宽窄巷子步行穿过长顺下街约 900米即可直达人民公园 (用时 ~12分钟)',
      tip: '贴士：距离极近，一路上可以买大熊猫文创和小吃，体验老成都烟火气。'
    },
    'dadonghai-luhuitou': {
      icon: '🚌',
      text: '公交直达：在大东海广场站乘坐公交26路/55路直达【鹿回头景区站】下车 (用时约 15分钟，票价 ¥2)',
      tip: '贴士：鹿回头景区已免门票，傍晚登顶俯瞰三亚全景和夜景极赞。'
    },
    'dadonghai-xiaodonghai': {
      icon: '🚌',
      text: '公交直达：在大东海广场站乘坐公交微3路直达【半山半岛站】(小东海旁) 下车 (用时约 12分钟，票价 ¥2)',
      tip: '贴士：两地相距很近，打车也仅需 10元左右。'
    },
    'yalongbay_forest-taiyangwan': {
      icon: '🚖',
      text: '打车/观光车：两地都在亚龙湾，建议打车走太阳湾最美沿海公路，车程约 15分钟，车费约 ¥20元',
      tip: '贴士：太阳湾路是三亚最美海景公路，一路上依山傍海，拍照超出片！'
    },
    'atlantis_water-dutyfree': {
      icon: '🚌',
      text: '公交/免费大巴：在亚特兰蒂斯乘坐海棠湾3路或三亚国际免税城免费穿梭巴士直达，用时约 10分钟 (票价 ¥2)',
      tip: '贴士：酒店住客可向前台咨询是否有直达免税城的免费穿梭车。'
    },
    'atlantis_water-houhai': {
      icon: '🚌',
      text: '公交直达：在亚特兰蒂斯乘坐海棠湾3路/33路直达【藤海小学站】(后海村口)，用时约 12分钟 (票价 ¥2)',
      tip: '贴士：后海村适合冲浪和吃夜市海鲜，打车约 10元。'
    },
    'dutyfree-houhai': {
      icon: '🚌',
      text: '公交直达：在三亚国际免税城乘坐海棠湾3路/33路直达【藤海小学站】(后海村口)，用时约 15分钟 (票价 ¥2)',
      tip: '贴士：买完免税品去后海村吹海风非常顺路，相距仅 3.5公里。'
    }
  };

  const key1 = `${spot1Id}-${spot2Id}`;
  const key2 = `${spot2Id}-${spot1Id}`;
  if (spot1Id && spot2Id) {
    if (walkingPairs[key1]) return walkingPairs[key1];
    if (walkingPairs[key2]) {
      const original = walkingPairs[key2];
      return {
        icon: original.icon,
        text: original.text.replace('从', '临时从').replace('至', '往').replace('临时从', '从'),
        tip: original.tip
      };
    }
  }

  // 1.5 相同站点判定（同站即步行）
  if (m1.station && m2.station && m1.station === m2.station) {
    return {
      icon: '🚶',
      text: `近距步行：两地均靠近【${m1.station}】，直接步行即可直达，路程约 300-800米 (用时 ~5-10分钟)`,
      tip: `贴士：属于同一个地铁站/商圈周边，建议步行或骑行共享单车，无需乘地铁。`
    };
  }

  if (m1.busStop && m2.busStop && m1.busStop === m2.busStop) {
    return {
      icon: '🚶',
      text: `近距步行：两地均位于【${m1.busStop}】公交站周边，距离很近，直接步行即可 (用时 ~5-10分钟)`,
      tip: `贴士：同区域景点/住处，散步即可到达，非常方便。`
    };
  }

  // 2. 城市特定远郊景点和接驳处理
  if (destination === '北京') {
    if (spot1Id === 'badaling' || spot2Id === 'badaling') {
      const otherSpot = spot1Id === 'badaling' ? m2.name : m1.name;
      return {
        icon: '🚌',
        text: `市郊铁路/专线：在德胜门乘坐公交877路长城一站直达专线至【八达岭长城站】(车程约 90分钟，票价 ¥30)；或在黄土店站乘市郊铁路S2线直达【八达岭站】(单程约 80分钟，票价 ¥6)`,
        tip: `从【${otherSpot}】出发，建议先乘地铁到德胜门或黄土店站，S2线动车体验性强且不堵车。`
      };
    }
    if (spot1Id === 'universal' || spot2Id === 'universal') {
      const otherSpot = spot1Id === 'universal' ? m2.name : m1.name;
      const otherStation = spot1Id === 'universal' ? m2.station : m1.station;
      return {
        icon: '🚇',
        text: `地铁直达/换乘：搭乘地铁1号线八通线或7号线，直接在【环球度假区站】(B口出) 下车，全程约 45-50分钟，票价 ¥6-8`,
        tip: `从【${otherSpot}】出发，建议先步行至【${otherStation}】乘坐地铁，地铁直达环球影城安检口，最省时！`
      };
    }
  }

  if (destination === '成都') {
    if (spot1Id === 'pandas' || spot2Id === 'pandas') {
      const otherSpot = spot1Id === 'pandas' ? m2.name : m1.name;
      return {
        icon: '🚇',
        text: `地铁+接驳线：搭乘地铁3号线至【军区总医院站】(B口出)，直接换乘熊猫基地景区公交接驳线 (D025路) 直达熊猫基地南门，全程用时约 40分钟，票价 ¥4`,
        tip: `去看大熊猫一定要早起，上午 8:30-10:00 是大熊猫吃竹子最活泼的时间段。`
      };
    }
    if (spot1Id === 'dujiangyan' || spot2Id === 'dujiangyan') {
      const otherSpot = spot1Id === 'dujiangyan' ? m2.name : m1.name;
      return {
        icon: '🚄',
        text: `城际动车+公交：先搭乘地铁2号线至【犀浦站】，换乘成灌线动车/城际列车直达【都江堰站】(动车约 30分钟，票价 ¥10)，出站换乘公交101路直达都江堰景区 (约15分钟)`,
        tip: `从【${otherSpot}】前往都江堰，乘坐城际动车性价比极高，且避开了成灌高速可能的拥堵。`
      };
    }
    if (spot1Id === 'qingcheng' || spot2Id === 'qingcheng') {
      const otherSpot = spot1Id === 'qingcheng' ? m2.name : m1.name;
      return {
        icon: '🚄',
        text: `城际动车+接驳：先搭乘地铁2号线至【犀浦站】，换乘成灌线动车直达【青城山站】(动车约 35分钟，票价 ¥15)，出站乘坐景区观光车 (约5分钟，票价 ¥10) 直达售票处`,
        tip: `青城山环境幽静，适合徒步，建议安排一整天。`
      };
    }
  }

  // 3. 通用路由计算（使用 zone 差异来决定乘车时间、站数和票价）
  const zoneDiff = Math.abs(m1.zone - m2.zone);
  let estPrice = 3;
  let estTime = 15;
  let stops = 4;

  if (zoneDiff === 0) {
    stops = 2;
    estTime = 8;
    estPrice = 2;
  } else if (zoneDiff === 1) {
    stops = 4;
    estTime = 12;
    estPrice = 3;
  } else if (zoneDiff === 2) {
    stops = 7;
    estTime = 20;
    estPrice = 4;
  } else {
    stops = 11;
    estTime = 35;
    estPrice = 6;
  }

  // 4. 地铁路由（北京、成都）
  if (destination === '北京' || destination === '成都') {
    if (m1.lines && m2.lines) {
      const commonLines = m1.lines.filter(line => m2.lines.includes(line));
      if (commonLines.length > 0) {
        return {
          icon: '🚇',
          text: `地铁直达：在【${m1.station}】乘坐【${commonLines[0]}】直达【${m2.station}】(${m2.exit || '出站'}下车)，坐 ${stops}站，用时约 ${estTime}分钟，票价 ¥${estPrice}`,
          tip: `两地位于同一条地铁干线上，无需任何换乘，出行极度顺畅！`
        };
      } else {
        const line1 = m1.lines[0];
        const line2 = m2.lines[0];
        if (line1 && line2) {
          const transferStation = destination === '北京' ? getTransferStation(line1, line2) : getChengduTransfer(line1, line2);
          const transferTime = estTime + 10;
          const transferPrice = estPrice + 1;
          return {
            icon: '🚇',
            text: `地铁换乘：在【${m1.station}】乘坐【${line1}】，在【${transferStation}】换乘【${line2}】至【${m2.station}】(${m2.exit || '出站'}下车)，全程约 ${transferTime}分钟，票价 ¥${transferPrice}`,
            tip: `市区核心线换乘均有盲道和直梯，大流量站注意跟着指示牌走。`
          };
        }
      }
    }
  }

  // 5. 公交路由（三亚）
  if (destination === '三亚') {
    if (spot1Id === 'xidao' || spot2Id === 'xidao') {
      const mainlandSpot = spot1Id === 'xidao' ? m2 : m1;
      const busLine = mainlandSpot.busLines ? (mainlandSpot.busLines[0] || '25路/26路') : '25路/26路';
      if (spot1Id === 'xidao') {
        return {
          icon: '🚌',
          text: `轮渡+公交：先在西岛码头乘景区客船返回肖旗港码头 (船程 15分钟)，随后在码头换乘【${busLine}】至【${mainlandSpot.busStop}】下车 (用时约 ${estTime + 10}分钟，票价 ¥3)`,
          tip: `请妥善保管好您的西岛往返船票凭证，按指引排队有序登船离岛。`
        };
      } else {
        return {
          icon: '🚌',
          text: `公交+轮渡：在【${mainlandSpot.busStop}】乘坐【${busLine}】公交至【肖旗港陆岛交通码头站】下车 (用时约 ${estTime + 10}分钟，票价 ¥3)，换乘西岛景区客船登岛 (船程 15分钟，包含在景区套票内)`,
          tip: `请注意西岛的最晚离岛船班通常为下午 17:30，建议安排好时间返回。`
        };
      }
    }
    if (spot1Id === 'wuzhizhou' || spot2Id === 'wuzhizhou') {
      const mainlandSpot = spot1Id === 'wuzhizhou' ? m2 : m1;
      const busLine = mainlandSpot.busLines ? (mainlandSpot.busLines.includes('33路') ? '33路' : (mainlandSpot.busLines[0] || '33路/28路')) : '33路/28路';
      if (spot1Id === 'wuzhizhou') {
        return {
          icon: '🚌',
          text: `快船+公交：先在蜈支洲岛码头乘景区大轮渡返回后海码头 (船程 20分钟)，随后在码头换乘【${busLine}】至【${mainlandSpot.busStop}】下车 (用时约 ${estTime + 15}分钟，票价 ¥3-5)`,
          tip: `海棠湾各路公交末班车多在傍晚18点左右，请合理安排出岛时间。`
        };
      } else {
        return {
          icon: '🚌',
          text: `公交+快船：在【${mainlandSpot.busStop}】乘坐【${busLine}】公交至【蜈支洲岛码头站】下车 (用时约 ${estTime + 15}分钟，票价 ¥3-5)，随后换乘景区轮渡登岛 (船程约 20分钟)`,
          tip: `蜈支洲岛海水清澈度极佳，是潜水胜地，回程末班船约为下午 18:00。`
        };
      }
    }

    if (m1.busLines && m2.busLines) {
      const commonBuses = m1.busLines.filter(bus => m2.busLines.includes(bus));
      if (commonBuses.length > 0) {
        return {
          icon: '🚌',
          text: `公交直达：在【${m1.busStop}】乘坐【${commonBuses[0]}】公交车直达【${m2.busStop}】下车，用时约 ${estTime + 10}分钟，票价 ¥${estPrice}`,
          tip: `两地有直达旅游公交，可坐在窗边饱览三亚美丽的椰风海韵海滨大道！`
        };
      } else {
        const bus1 = m1.busLines[0] || '25路';
        const bus2 = m2.busLines[0] || '26路';
        const transferTime = estTime + 20;
        const transferPrice = Math.min(10, estPrice + 2);
        return {
          icon: '🚌',
          text: `公交换乘：在【${m1.busStop}】乘坐【${bus1}】，在【大东海广场站】换乘【${bus2}】至【${m2.busStop}】下车，全程约 ${transferTime}分钟，票价 ¥${transferPrice}`,
          tip: `三亚公交车多为分段收费，上车前请向司机确认并准备好零钱或乘车码。`
        };
      }
    }
  }

  // 兜底
  return {
    icon: '🚇',
    text: `交通出行：从【${m1.name || '起点'}】搭乘公共交通至【${m2.name || '终点'}】下车，用时约 ${estTime + 5}分钟，票价 ¥${estPrice}`,
    tip: '市区内建议优先搭乘轨道交通，避开高峰期路面拥堵。'
  };
};

// 景点对景点路由接口
export const getTransitAdvice = (destination, spot1Id, spot2Id) => {
  const m1 = transitMeta[spot1Id];
  const m2 = transitMeta[spot2Id];
  if (!m1 || !m2) return null;
  return getTransitAdviceCustom(destination, m1, m2, spot1Id, spot2Id);
};

// 酒店对景点路由接口
export const getHotelToSpotAdvice = (destination, hotel, spotId) => {
  if (!hotel || !spotId) return null;
  const m1 = getHotelTransitMeta(hotel, destination);
  const m2 = transitMeta[spotId];
  if (!m1 || !m2) return null;

  // 将起点名称覆盖为具体的酒店名称，车站保持一致
  const hotelMeta = { ...m1, name: hotel.name };
  return getTransitAdviceCustom(destination, hotelMeta, m2, '', spotId);
};

// 景点对酒店路由接口
export const getSpotToHotelAdvice = (destination, spotId, hotel) => {
  if (!hotel || !spotId) return null;
  const m1 = transitMeta[spotId];
  const m2 = getHotelTransitMeta(hotel, destination);
  if (!m1 || !m2) return null;

  // 将终点名称覆盖为具体的酒店名称，车站保持一致
  const hotelMeta = { ...m2, name: hotel.name };
  return getTransitAdviceCustom(destination, m1, hotelMeta, spotId, '');
};
