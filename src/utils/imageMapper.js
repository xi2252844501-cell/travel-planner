// RoamPlanner - Premium Travel Image Asset Mapper
// Sourced from Unsplash high-quality travel photography

const attractionImages = {
  // === 北京景点 ===
  gugong: '/images/real/beijing/gugong.jpg', // 故宫红墙
  tiantan: '/images/real/beijing/tiantan.jpg', // 天坛祈年殿
  yiheyuan: '/images/real/beijing/yiheyuan.jpg', // 颐和园亭台
  universal: '/images/real/beijing/universal.jpg', // 主题乐园城堡
  badaling: '/images/real/beijing/badaling.jpg', // 长城
  sanlitun: '/images/real/beijing/sanlitun.jpg', // 时尚街区霓虹
  tiananmen: '/images/real/beijing/tiananmen.jpg', // 广场
  jingshan: '/images/real/beijing/jingshan.jpg', // 景山鸟瞰
  nanluoguxiang: '/images/real/beijing/nanluoguxiang.jpg', // 什刹海胡同
  gongwangfu: '/images/real/beijing/gongwangfu.jpg', // 中式庭院

  // === 三亚景点 ===
  yemeng: '/images/real/sanya/yemeng.jpg', // 椰林日落
  xidao: '/images/real/sanya/xidao.jpg', // 沙滩海景
  nanshan: '/images/real/sanya/nanshan.jpg', // 海上观音
  dadonghai: '/images/real/sanya/dadonghai.jpg', // 大东海椰风
  luhuitou: '/images/real/sanya/luhuitou.jpg', // 俯瞰港湾
  qianguqing: '/images/real/sanya/qianguqing.jpg', // 三亚千古情演艺
  xiaodonghai: '/images/real/sanya/xiaodonghai.jpg', // 静谧礁石海滩
  yalongbay_forest: '/images/real/sanya/yalongbay_forest.jpg', // 热带雨林
  taiyangwan: '/images/real/sanya/taiyangwan.jpg', // 沿海公路
  wuzhizhou: '/images/real/sanya/wuzhizhou.jpg', // 蜈支洲碧蓝海水
  atlantis_water: '/images/real/sanya/atlantis_water.jpg', // 水上乐园
  dutyfree: '/images/real/sanya/dutyfree.jpg', // 免税店建筑
  houhai: '/images/real/sanya/houhai.jpg', // 后海冲浪

  // === 成都景点 ===
  pandas: '/images/real/chengdu/pandas.jpg', // 大熊猫
  kuanzhai: '/images/real/chengdu/kuanzhai.jpg', // 宽窄巷子街景
  dufu: '/images/real/chengdu/dufu.jpg', // 杜甫草堂翠竹
  jinli: '/images/real/chengdu/jinli.jpg', // 锦里红灯笼
  taikooli: '/images/real/chengdu/taikooli.jpg', // 太古里潮流
  wuhou: '/images/real/chengdu/wuhou.jpg', // 武侯祠红墙
  peoplespark: '/images/real/chengdu/peoplespark.jpg', // 人民公园茶座
  dujiangyan: '/images/real/chengdu/dujiangyan.jpg', // 都江堰水利
  qingcheng: '/images/real/chengdu/qingcheng.jpg', // 青城山幽静
  jinsha: '/images/real/chengdu/jinsha.jpg', // 金沙太阳神鸟
};

const hotelImages = {
  // === 北京酒店 ===
  bj_bulgari: '/images/real/beijing/bj_bulgari.jpg', // 宝格丽高档外观
  bj_rosewood: '/images/real/beijing/bj_rosewood.jpg', // 奢华大堂
  bj_mandarin_oriental: '/images/real/beijing/bj_mandarin_oriental.jpg', // 精致客房
  bj_peninsula: '/images/real/beijing/bj_peninsula.jpg', // 半岛酒店泳池
  bj_luxury_yard: '/images/real/beijing/bj_luxury_yard.jpg', // 四合院中庭
  bj_hanting_qianmen: '/images/real/beijing/bj_hanting_qianmen.jpg', // 汉庭快捷
  bj_hostel: '/images/real/beijing/bj_hostel.jpg', // 青年旅舍床位
  bj_loft: '/images/real/beijing/bj_loft.jpg', // 设计师民宿
  bj_huanting_anjiao: '/images/real/beijing/bj_huanting_anjiao.jpg', // 全季舒适
  bj_capital: '/images/real/beijing/bj_capital.jpg', // 经典宾馆
  bj_legendale: '/images/real/beijing/bj_legendale.jpg', // 励骏酒店欧式
  bj_woodhouse: '/images/real/beijing/bj_woodhouse.jpg', // 南锣鼓巷四合院
  bj_summit: '/images/real/beijing/bj_summit.jpg', // 国贸大饭店高空
  bj_jen: '/images/real/beijing/bj_jen.jpg', // 潮玩新国贸
  bj_dequan_apartment: '/images/real/beijing/bj_dequan_apartment.png', // 公寓房
  bj_chao: '/images/real/beijing/bj_chao.jpg', // 三里屯CHAO艺术感
  bj_westin_chaoyang: '/images/real/beijing/bj_westin_chaoyang.jpg', // 威斯汀品质
  bj_universal_loft: '/images/real/beijing/bj_universal_loft.jpg', // 城堡民宿
  bj_beishenshu_homestay: '/images/real/beijing/bj_beishenshu_homestay.png', // 通州美宿
  bj_huanxuan_hotel: '/images/real/beijing/bj_huanxuan_hotel.jpg', // 商务全季

  // === 三亚酒店 ===
  sy_sijihaiting: '/images/real/sanya/sy_sijihaiting.jpg', // 四季海庭
  sy_haitangwan9: '/images/real/sanya/sy_haitangwan9.jpg', // 海堂湾九号
  sy_qingnenglijing: '/images/real/sanya/sy_qingnenglijing.jpg', // 清能丽景
  sy_crowne_plaza: '/images/real/sanya/sy_crowne_plaza.jpg', // 仁恒皇冠假日
  sy_edition: '/images/real/sanya/sy_edition.jpg', // 艾迪逊极简奢华
  sy_rosewood: '/images/real/sanya/sy_rosewood.jpg', // 瑰丽无边泳池
  sy_westin: '/images/real/sanya/sy_westin.jpg', // 威斯汀热带园林
  sy_sofitel: '/images/real/sanya/sy_sofitel.jpg', // 索菲特法式度假
  sy_fairmont: '/images/real/sanya/sy_fairmont.jpg', // 费尔蒙奢华
  sy_atlantis: '/images/real/sanya/sy_atlantis.jpg', // 亚特兰蒂斯水世界外观
  sy_albion: '/images/real/sanya/sy_albion.jpg', // 度假公寓
  sy_houhai_homestay: '/images/real/sanya/sy_houhai_homestay.png', // 浪人民宿
  sy_horizon: '/images/real/sanya/sy_horizon.jpg', // 天域亲子
  sy_intime: '/images/real/sanya/sy_intime.jpg', // 银泰度假
  sy_dadonghai_hotel: '/images/real/sanya/sy_dadonghai_hotel.jpg', // 大东海精品
  sy_south_china: '/images/real/sanya/sy_south_china.jpg', // 南中国海景
  sy_parkhyatt: '/images/real/sanya/sy_parkhyatt.jpg', // 柏悦建筑美学
  sy_stregis: '/images/real/sanya/sy_stregis.jpg', // 瑞吉游艇码头
  sy_ritzcarlton: '/images/real/sanya/sy_ritzcarlton.jpg', // 丽思卡尔顿经典
  sy_intercontinental: '/images/real/sanya/sy_intercontinental.jpg', // 半山半岛洲际

  // === 成都酒店 ===
  cd_zhengyuan_xiyue: '/images/real/chengdu/cd_zhengyuan_xiyue.jpg', // 正源禧悦
  cd_niccolo: '/images/real/chengdu/cd_niccolo.jpg', // 尼依格罗高空
  cd_mumianhua: '/images/real/chengdu/cd_mumianhua.jpg', // 木棉花精品
  cd_luxury: '/images/real/chengdu/cd_luxury.jpg', // 博舍庭院
  cd_gulf_hotel: '/images/real/chengdu/cd_gulf_hotel.jpg', // 海湾酒店
  cd_jiuyanqiao_riverview: '/images/real/chengdu/cd_jiuyanqiao_riverview.jpg', // 九眼桥河景房
  cd_langliz_wenshu: '/images/real/chengdu/cd_langliz_wenshu.jpg', // 朗丽兹
  cd_kuanzhai_yard: '/images/real/chengdu/cd_kuanzhai_yard.jpg', // 宽窄四合院
  cd_grand_hyatt: '/images/real/chengdu/cd_grand_hyatt.jpg', // 君悦奢华
  cd_ins_loft: '/images/real/chengdu/cd_ins_loft.jpg', // 小森林民宿
  cd_jinjiang_inn: '/images/real/chengdu/cd_jinjiang_inn.jpg', // 锦江之星
  cd_hostel: '/images/real/chengdu/cd_hostel.jpg', // 青年旅舍
  cd_stregis: '/images/real/chengdu/cd_stregis.jpg', // 瑞吉奢华客房
  cd_canopy: '/images/real/chengdu/cd_canopy.jpg', // 希尔顿嘉悦里
  cd_temple_house_loft: '/images/real/chengdu/cd_temple_house_loft.jpg', // 繁花美学公寓
  cd_enji: '/images/real/chengdu/cd_enji.jpg', // 恩季酒店
  cd_dorsett: '/images/real/chengdu/cd_dorsett.jpg', // 帝盛精品
  cd_fraser: '/images/real/chengdu/cd_fraser.jpg', // 辉盛阁公寓
  cd_qingcheng_mountain: '/images/real/chengdu/cd_qingcheng_mountain.jpg', // 温泉民宿
  cd_six_senses: '/images/real/chengdu/cd_six_senses.jpg', // 六善奢华木屋
  cd_shanyin_sanjing: '/images/real/chengdu/cd_shanyin_sanjing.jpg', // 森林温泉
};

export const defaultImages = {
  北京: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&auto=format&fit=crop&q=60',
  三亚: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop&q=60',
  成都: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&auto=format&fit=crop&q=60',
};


export function getAttractionImage(id, destination = '三亚') {
  if (attractionImages[id]) {
    return attractionImages[id];
  }
  return defaultImages[destination] || defaultImages['三亚'];
}

export function getHotelImage(id, destination = '三亚') {
  if (hotelImages[id]) {
    return hotelImages[id];
  }
  return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60';
}
