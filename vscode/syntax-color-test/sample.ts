// モジュールとして扱い、ほかの比較サンプルと宣言が衝突しないようにする。
export {};

const MIN_PRICE = 100;

enum Status { ACTIVE = "ACTIVE", INACTIVE = "INACTIVE" }

interface Named {
  getName(): string;
}

class Item implements Named {
  public readonly name: string;
  public readonly price: number;
  public readonly status: Status;

  constructor(name: string, price: number, status: Status) {
    this.name = name;
    this.price = price;
    this.status = status;
  }

  public getName(): string {
    return this.name;
  }
}

/** 標準デコレーター。Javaの@Demoと比較できる、処理を変えないマーカー。 */
function demo(value: Function, context: ClassDecoratorContext): void {
  void value;
  void context;
}

@demo
class Processor<T extends Named> {
  public static readonly description = "item processor";
  private readonly prefix: string;
  public count = 0;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  public collect(items: T[], predicate: (item: T) => boolean): string[] {
    const labels: string[] = [];
    for (const item of items) {
      if (predicate(item)) {
        labels.push(this.prefix + item.getName());
        this.count++;
      } else {
        // 対象外の商品はスキップ。
        continue;
      }
    }
    return labels;
  }
}

function identity<T>(value: T): T {
  return value;
}

function main(): void {
  const prefix = "item:";
  const items: Item[] = [
    new Item("apple", 120, Status.ACTIVE),
    new Item("pear", 80, Status.ACTIVE),
    new Item("plum", 150, Status.INACTIVE)
  ];
  const processor = new Processor<Item>(prefix);
  const isEligible = (item: Item): boolean =>
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
  const missing: Item | null = null;
  const hasMissing = missing !== null || processor.count === 0;
  const summary = labels.join(",") + " total=" + identity<number>(total)
    + " missing=" + hasMissing;
  console.log(summary);
}

main();
