import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

/** 同じ商品データから、条件を満たす名前と合計金額を求める比較サンプル。 */
public class Sample {
    public static final int MIN_PRICE = 100;

    @interface Demo {}

    public enum Status { ACTIVE, INACTIVE }

    public interface Named {
        String getName();
    }

    public static final class Item implements Named {
        public final String name;
        public final int price;
        public final Status status;

        public Item(String name, int price, Status status) {
            this.name = name;
            this.price = price;
            this.status = status;
        }

        @Override
        public String getName() {
            return this.name;
        }
    }

    @Demo
    public static class Processor<T extends Named> {
        public static final String description = "item processor";
        private final String prefix;
        public int count = 0;

        public Processor(String prefix) {
            this.prefix = prefix;
        }

        public List<String> collect(List<T> items, Function<T, Boolean> predicate) {
            final List<String> labels = new ArrayList<>();
            for (final T item : items) {
                if (predicate.apply(item)) {
                    labels.add(this.prefix + item.getName());
                    this.count++;
                } else {
                    // 対象外の商品はスキップ。
                    continue;
                }
            }
            return labels;
        }
    }

    public static <T> T identity(T value) {
        return value;
    }

    public static void main(String[] args) {
        final String prefix = "item:";
        final List<Item> items = List.of(
            new Item("apple", 120, Status.ACTIVE),
            new Item("pear", 80, Status.ACTIVE),
            new Item("plum", 150, Status.INACTIVE)
        );
        final Processor<Item> processor = new Processor<>(prefix);
        final Function<Item, Boolean> isEligible = item ->
            item.status == Status.ACTIVE && item.price >= MIN_PRICE;
        final List<String> labels = processor.collect(items, isEligible);

        int index = 0;
        int total = 0;
        while (index < items.size()) {
            final Item item = items.get(index);
            final boolean enabled = true;
            final boolean rejected = false;
            if (enabled && !rejected && isEligible.apply(item)) {
                total = total + item.price * 2 - item.price / 2;
            }
            index++;
        }
        final Item missing = null;
        final boolean hasMissing = missing != null || processor.count == 0;
        final String summary = String.join(",", labels) + " total=" + identity(total)
            + " missing=" + hasMissing;
        System.out.println(summary);
    }
}
