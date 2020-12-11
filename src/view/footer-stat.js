import Abstract from "./abstract";

const createFooterStat = (n) => {
  return (`${n}`);
};

export default class FooterStat extends Abstract {
  constructor(n) {
    super();
    this._n = n;
  }

  getTemplate() {
    return createFooterStat(this._n);
  }
}
