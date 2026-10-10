// @ts-check
// IIFEで閉じ、同じフォルダのTypeScriptサンプルとのグローバル名の衝突を避ける。
(() => {
  const MIN_PRICE = 100;

  /** @enum {string} JSではenumの代わりに凍結したオブジェクトを使う。 */
  const Status = Object.freeze({ ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" });

  /**
   * JSではinterfaceの代わりにJSDocの構造型を使う。
   * @typedef {{ getName: () => string }} Named
   */

  /** @implements {Named} */
  class Item {
    /** @type {string} */
    name;
    /** @type {number} */
    price;
    /** @type {Status} */
    status;

    /** @param {string} name @param {number} price @param {Status} status */
    constructor(name, price, status) {
      this.name = name;
      this.price = price;
      this.status = status;
    }

    getName() {
      return this.name;
    }
  }

  /** @template {Named} T ジェネリクスはJSDocで表現する。 */
  class Processor {
    static description = "item processor";
    #prefix;
    count = 0;

    /** @param {string} prefix */
    constructor(prefix) {
      this.#prefix = prefix;
    }

    /** @param {T[]} items @param {(item: T) => boolean} predicate @returns {string[]} */
    collect(items, predicate) {
      /** @type {string[]} */
      const labels = [];
      for (const item of items) {
        if (predicate(item)) {
          labels.push(this.#prefix + item.getName());
          this.count++;
        } else {
          // 対象外の商品はスキップ。
          continue;
        }
      }
      return labels;
    }
  }

  /** @template T @param {T} value @returns {T} */
  function identity(value) {
    return value;
  }

  function main() {
    const prefix = "item:";
    const items = [
      new Item("apple", 120, Status.ACTIVE),
      new Item("pear", 80, Status.ACTIVE),
      new Item("plum", 150, Status.INACTIVE)
    ];
    /** @type {Processor<Item>} コンストラクタ引数だけではTを推論できないため指定。 */
    const processor = new Processor(prefix);
    /** @param {Item} item */
    const isEligible = item =>
      item.status === Status.ACTIVE && item.price >= MIN_PRICE;
    const labels = processor.collect(items, isEligible);

    let index = 0;
    let total = 0;
    while (index < items.length) {
      const item = items[index];
      const enabled = true;
      const rejected = false;
      if (enabled && !rejected && isEligible(item)) {
        total = total + item.price * 2 - item.price / 2;
      }
      index++;
    }
    /** @type {Item | null} */
    const missing = null;
    const hasMissing = missing !== null || processor.count === 0;
    const summary = labels.join(",") + " total=" + identity(total)
      + " missing=" + hasMissing;
    console.log(summary);
  }

  main();
})();
