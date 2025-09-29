import { utilService } from "./util.service.js";
import { storageService } from "./async-storage.service.js";

const TOY_KEY = "toyDB";
_createToys();

export const toyService = {
  query,
  get,
  remove,
  save,
  getEmptyToy,
  getDefaultFilter,
  getFilterFromSearchParams,
  getPriceStats,
  getCategories,
  getRange,
};
// For Debug (easy access from console):
window.cs = toyService;

function query(filterBy = {}) {
  return storageService.query(TOY_KEY).then((toys) => {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, "i");
      toys = toys.filter((toy) => regExp.test(toy.txt));
    }

    if (filterBy.price) {
      toys = toys.filter((toy) => toy.price <= filterBy.price);
    }

    if (filterBy.inStock !== "") {
      if (filterBy.inStock==="inStock") toys = toys.filter((toy) => toy.inStock);
      if (filterBy.inStock==="soldOut") toys = toys.filter((toy) => !toy.inStock);
    }

    if (filterBy.category !== "All") {
      toys = toys.filter((toy) =>
        toy.labels.some((category) => category === filterBy.category)
      );
    }
    if(filterBy.sort !== ''){
      switch (filterBy.sort){
        case "name":{
          toys = toys.sort((toy1,toy2)=>{
            const t1 = toy1.txt.toLowecase()
            const t2 = toy2.txt.toLowecase()
            if(t1 < t2) return -1;
            if(t1 > t2) return 1;
            return 0;
          }
          )
          break;
        }
        case "price":{
          toys = toys.sort((toy1,toy2)=>toy1.price - toy2.price)
          break;
        }
        case "createdAt":{
          toys = toys.sort((toy1,toy2)=>toy1.createdAt - toy2.createdAt)
          break;
        }
      }
    }

    return toys;
  });
}

function get(toyId) {
  return storageService.get(TOY_KEY, toyId).then((toy) => {
    toy = _setNextPrevToyId(toy);
    return toy;
  });
}

function remove(toyId) {
  return storageService.remove(TOY_KEY, toyId);
}

function save(toy) {
  if (toy._id) {
    // TOY - updatable fields
    toy.updatedAt = Date.now();
    return storageService.put(TOY_KEY, toy);
  } else {
    toy.createdAt = toy.updatedAt = Date.now();
    const toyToPost = _fillToyMissingParts(toy);
    return storageService.post(TOY_KEY, toyToPost);
  }
}

function getEmptyToy(txt = "", price = 5) {
  return { txt, price, inStock: false };
}

function getDefaultFilter() {
  return { txt: "", price: 0, inStock: "", category: "All", sort:'' };
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter();
  const filterBy = {};
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || "";
  }
  return filterBy;
}

function getPriceStats() {
  return storageService.query(TOY_KEY).then((toys) => {
    const toyCountByPriceMap = _getToyCountByPriceMap(toys);
    const data = Object.keys(toyCountByPriceMap).map((speedName) => ({
      title: speedName,
      value: toyCountByPriceMap[speedName],
    }));
    return data;
  });
}

function _createToys() {
  let toys = utilService.loadFromStorage(TOY_KEY);
  if (!toys || !toys.length) {
    toys = [];
    const txts = [
      "Talking Doll",
      "Baby",
      "Box Game",
      "Football",
      "Tennis",
      "Basketball",
      "Bicycle",
      "Roller-blades",
    ];
    for (let i = 0; i < 20; i++) {
      const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)];
      toys.push(
        _createToy(txt + (i + 1), utilService.getRandomIntInclusive(1, 10))
      );
    }
    utilService.saveToStorage(TOY_KEY, toys);
  }
}

function _createToy(txt, price) {
  const toy = getEmptyToy(txt, price);
  toy._id = utilService.makeId();
  toy.createdAt =
    Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24);
  toy.inStock = utilService.getRandomBoolean();
  toy.labels = [];
  const labels = [
    "On wheels",
    "Box game",
    "Art",
    "Baby",
    "Doll",
    "Puzzle",
    "Outdoor",
    "Battery Powered",
  ];
  for (let i = 0; i < 3; i++) {
    toy.labels.push(
      labels[utilService.getRandomIntInclusive(0, labels.length - 1)]
    );
  }
  return toy;
}

function _setNextPrevToyId(toy) {
  return storageService.query(TOY_KEY).then((toys) => {
    const toyIdx = toys.findIndex((currToy) => currToy._id === toy._id);
    const nextToy = toys[toyIdx + 1] ? toys[toyIdx + 1] : toys[0];
    const prevToy = toys[toyIdx - 1] ? toys[toyIdx - 1] : toys[toys.length - 1];
    toy.nextToyId = nextToy._id;
    toy.prevToyId = prevToy._id;
    return toy;
  });
}

function _getToyCountByPriceMap(toys) {
  const toyCountByPriceMap = toys.reduce(
    (map, toy) => {
      if (toy.price < 3) map.low++;
      else if (toy.price < 7) map.normal++;
      else map.urgent++;
      return map;
    },
    { low: 0, normal: 0, urgent: 0 }
  );
  return toyCountByPriceMap;
}

function getCategories(toys) {
  const categoriesCollector = ["All"];
  if (toys.length === 0) return categoriesCollector;
  toys.forEach((toy) => {
    toy.labels.forEach((toyCategory) => {
      if (!categoriesCollector.some((category) => toyCategory === category))
        categoriesCollector.push(toyCategory);
    });
  });
  return categoriesCollector;
}

function getRange(toys) {
  if (toys.length === 0) return { min: 0, max: 5000 };
  const range = {};
  range.min = range.max = toys[0].price;
  toys.forEach((toy) => {
    if (toy.price > range.max) range.max = toy.price;
    if (toy.price < range.min) range.min = toy.price;
  });
  return range;
}

function _fillToyMissingParts(toy){
toy.inStock = utilService.getRandomBoolean();
  toy.labels = [];
  const labels = [
    "On wheels",
    "Box game",
    "Art",
    "Baby",
    "Doll",
    "Puzzle",
    "Outdoor",
    "Battery Powered",
  ];
  for (let i = 0; i < 3; i++) {
    toy.labels.push(
      labels[utilService.getRandomIntInclusive(0, labels.length - 1)]
    );
  return toy;
}
}
// Data Model:
// const toy = {
// _id: 't101',
// name: 'Talking Doll',
// price: 123,
// labels: ['Doll', 'Battery Powered', 'Baby'],
// createdAt: 1631031801011,
// inStock: true,
// }
