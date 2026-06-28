Javaのラムダ式でよく使われるのは、主に **Stream API**、**Comparator**、**関数型インタフェース**、**コールバック処理** です。

## 1. `Predicate<T>`：条件判定

`T` を受け取り、`boolean` を返します。

```java
Predicate<String> isEmpty = s -> s.isEmpty();

System.out.println(isEmpty.test("")); // true
```

Stream の `filter` でよく使います。

```java
List<String> names = Arrays.asList("Tanaka", "", "Suzuki");

List<String> result = names.stream()
        .filter(s -> !s.isEmpty())
        .collect(Collectors.toList());
```

意味は、

```java
s -> !s.isEmpty()
```

つまり、

```java
「文字列 s を受け取って、空でなければ true を返す」
```

です。

---

## 2. `Function<T, R>`：変換

`T` を受け取り、`R` を返します。

```java
Function<String, Integer> length = s -> s.length();

System.out.println(length.apply("Java")); // 4
```

Stream の `map` でよく使います。

```java
List<String> names = Arrays.asList("Tanaka", "Suzuki");

List<Integer> lengths = names.stream()
        .map(s -> s.length())
        .collect(Collectors.toList());
```

これは、

```java
String → Integer
```

に変換しています。

メソッド参照を使うと、こうも書けます。

```java
.map(String::length)
```

---

## 3. `Consumer<T>`：処理だけ行う

`T` を受け取り、戻り値はありません。

```java
Consumer<String> print = s -> System.out.println(s);

print.accept("Hello");
```

`forEach` でよく使います。

```java
List<String> names = Arrays.asList("Tanaka", "Suzuki");

names.forEach(s -> System.out.println(s));
```

メソッド参照ならこうです。

```java
names.forEach(System.out::println);
```

---

## 4. `Supplier<T>`：値を供給する

引数なしで、`T` を返します。

```java
Supplier<LocalDateTime> now = () -> LocalDateTime.now();

System.out.println(now.get());
```

よくある用途は、遅延生成です。

```java
Optional<String> name = Optional.empty();

String result = name.orElseGet(() -> "default");
```

`orElseGet` は、必要になったときだけラムダの中身を実行します。

---

## 5. `Comparator<T>`：並び替え

ラムダ式でかなりよく使います。

```java
List<String> names = Arrays.asList("Tanaka", "Abe", "Suzuki");

names.sort((a, b) -> a.length() - b.length());
```

文字列の長さ順に並べています。

ただし、実務では次の書き方の方が安全で読みやすいです。

```java
names.sort(Comparator.comparing(s -> s.length()));
```

メソッド参照を使うと、

```java
names.sort(Comparator.comparing(String::length));
```

---

## 6. `Runnable`：引数なし・戻り値なし

`Runnable` は昔からあるインタフェースですが、ラムダ式で書けます。

```java
Runnable task = () -> System.out.println("処理実行");

task.run();
```

スレッドでも使えます。

```java
new Thread(() -> System.out.println("別スレッドで実行")).start();
```

---

## 7. `BiFunction<T, U, R>`：2つ受け取って1つ返す

```java
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;

System.out.println(add.apply(3, 5)); // 8
```

`T` と `U` を受け取り、`R` を返します。

```java
(a, b) -> a + b
```

は、

```java
2つの値を受け取って、足した結果を返す
```

という意味です。

---

## 8. `UnaryOperator<T>`：同じ型に変換する

`T` を受け取り、同じ `T` を返します。

```java
UnaryOperator<Integer> doubleValue = x -> x * 2;

System.out.println(doubleValue.apply(10)); // 20
```

これは実質的には、

```java
Function<T, T>
```

です。

---

## 9. `BinaryOperator<T>`：同じ型を2つ受け取って同じ型を返す

```java
BinaryOperator<Integer> max = (a, b) -> a > b ? a : b;

System.out.println(max.apply(10, 20)); // 20
```

Stream の `reduce` でよく使います。

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

int sum = numbers.stream()
        .reduce(0, (a, b) -> a + b);
```

これは合計を求めています。

より短く書くなら、

```java
int sum = numbers.stream()
        .reduce(0, Integer::sum);
```

---

# よく使うラムダ式の形

## 引数1つ

```java
x -> x * 2
```

例：

```java
.map(x -> x * 2)
```

---

## 引数2つ

```java
(a, b) -> a + b
```

例：

```java
.reduce(0, (a, b) -> a + b)
```

---

## 戻り値なし

```java
x -> System.out.println(x)
```

例：

```java
.forEach(x -> System.out.println(x))
```

---

## 複数行の処理

```java
x -> {
    System.out.println(x);
    return x.length();
}
```

複数行にする場合は `{}` と `return` が必要です。

---

# 実務で特によく見る例

## 条件で絞り込む

```java
list.stream()
    .filter(item -> item.getCount() > 0)
    .collect(Collectors.toList());
```

---

## 値を取り出す

```java
list.stream()
    .map(item -> item.getName())
    .collect(Collectors.toList());
```

---

## 合計する

```java
int total = list.stream()
    .mapToInt(item -> item.getCount())
    .sum();
```

---

## 並び替える

```java
list.sort(Comparator.comparing(item -> item.getDate()));
```

---

## null でないものだけ残す

```java
list.stream()
    .filter(Objects::nonNull)
    .collect(Collectors.toList());
```

---

## Optional で使う

```java
Optional<String> value = Optional.of("Java");

value.ifPresent(s -> System.out.println(s));
```

```java
String result = value
        .map(s -> s.toUpperCase())
        .orElse("default");
```

---

# 覚える優先順位

まずはこの5つを覚えると十分です。

| 用途   | よく使う型            | 例                            |
| ---- | ---------------- | ---------------------------- |
| 条件判定 | `Predicate<T>`   | `x -> x > 0`                 |
| 変換   | `Function<T, R>` | `s -> s.length()`            |
| 処理実行 | `Consumer<T>`    | `s -> System.out.println(s)` |
| 値の供給 | `Supplier<T>`    | `() -> new ArrayList<>()`    |
| 並び替え | `Comparator<T>`  | `(a, b) -> a - b`            |

特に Java では、ラムダ式は **「処理を値として渡すための書き方」** と考えると理解しやすいです。
`filter` には「判定処理」、`map` には「変換処理」、`forEach` には「実行処理」を渡している、というイメージです。
