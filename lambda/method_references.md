**メソッド参照**とは、ラムダ式の中で「既存のメソッドを呼ぶだけ」の場合に、より短く書くための構文です。

記号は `::` を使います。

```java
System.out::println
```

これは、だいたい次のラムダ式と同じ意味です。

```java
s -> System.out.println(s)
```

つまり、メソッド参照は **ラムダ式の省略形** です。

---

## 1. `System.out::println`

よく見る例です。

```java
List<String> names = Arrays.asList("Tanaka", "Suzuki", "Sato");

names.forEach(s -> System.out.println(s));
```

これはメソッド参照でこう書けます。

```java
names.forEach(System.out::println);
```

意味は同じです。

```java
System.out::println
```

は、

```java
受け取った値を System.out.println に渡す
```

という意味です。

---

## 2. `String::length`

次のラムダ式があります。

```java
List<String> names = Arrays.asList("Tanaka", "Suzuki", "Abe");

List<Integer> lengths = names.stream()
        .map(s -> s.length())
        .collect(Collectors.toList());
```

これはメソッド参照でこう書けます。

```java
List<Integer> lengths = names.stream()
        .map(String::length)
        .collect(Collectors.toList());
```

ここが少し分かりにくいです。

```java
String::length
```

は、

```java
s -> s.length()
```

と同じです。

つまり、

```java
文字列を1つ受け取り、その文字列の length() を呼ぶ
```

という意味です。

---

## 3. `Integer::sum`

合計処理でも使います。

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

int total = numbers.stream()
        .reduce(0, (a, b) -> a + b);
```

これは次のように書けます。

```java
int total = numbers.stream()
        .reduce(0, Integer::sum);
```

`Integer::sum` は、

```java
(a, b) -> Integer.sum(a, b)
```

と同じです。

---

## 4. `Objects::nonNull`

`null` でないものだけ残す場合です。

```java
List<String> values = Arrays.asList("A", null, "B");

List<String> result = values.stream()
        .filter(s -> Objects.nonNull(s))
        .collect(Collectors.toList());
```

メソッド参照でこう書けます。

```java
List<String> result = values.stream()
        .filter(Objects::nonNull)
        .collect(Collectors.toList());
```

`Objects::nonNull` は、

```java
s -> Objects.nonNull(s)
```

と同じです。

---

# メソッド参照の主な種類

## 1. staticメソッド参照

形式：

```java
クラス名::staticメソッド名
```

例：

```java
Integer::parseInt
```

これは、

```java
s -> Integer.parseInt(s)
```

と同じです。

```java
List<String> values = Arrays.asList("1", "2", "3");

List<Integer> numbers = values.stream()
        .map(Integer::parseInt)
        .collect(Collectors.toList());
```

---

## 2. インスタンスメソッド参照

形式：

```java
オブジェクト::メソッド名
```

例：

```java
System.out::println
```

これは、

```java
x -> System.out.println(x)
```

と同じです。

---

## 3. 任意のオブジェクトのインスタンスメソッド参照

形式：

```java
クラス名::インスタンスメソッド名
```

例：

```java
String::length
```

これは、

```java
s -> s.length()
```

と同じです。

他にも、

```java
String::toUpperCase
```

は、

```java
s -> s.toUpperCase()
```

と同じです。

```java
List<String> result = names.stream()
        .map(String::toUpperCase)
        .collect(Collectors.toList());
```

---

## 4. コンストラクタ参照

形式：

```java
クラス名::new
```

例：

```java
ArrayList::new
```

これは、

```java
() -> new ArrayList<>()
```

のような意味です。

例：

```java
Supplier<List<String>> supplier = ArrayList::new;

List<String> list = supplier.get();
```

---

# ラムダ式とメソッド参照の対応

| ラムダ式                          | メソッド参照                |
| ----------------------------- | --------------------- |
| `s -> System.out.println(s)`  | `System.out::println` |
| `s -> s.length()`             | `String::length`      |
| `s -> s.toUpperCase()`        | `String::toUpperCase` |
| `s -> Integer.parseInt(s)`    | `Integer::parseInt`   |
| `(a, b) -> Integer.sum(a, b)` | `Integer::sum`        |
| `() -> new ArrayList<>()`     | `ArrayList::new`      |

---

# 重要な考え方

メソッド参照は、**完全に新しい仕組みではありません**。

ラムダ式で、

```java
x -> 既存メソッド(x)
```

のように、単に既存メソッドを呼んでいるだけなら、

```java
既存メソッドへの参照
```

として短く書ける、というものです。

例えば、

```java
.map(s -> s.length())
```

は「処理の中身」が `length()` を呼ぶだけなので、

```java
.map(String::length)
```

と書けます。

ただし、ラムダ式の中で追加の処理をしている場合は、メソッド参照にはしにくいです。

```java
.map(s -> s.trim().toUpperCase())
```

これは複数の処理をしているので、普通はラムダ式のまま書きます。

---

# 実務ではどう使い分けるか

基本は次の判断でよいです。

```java
s -> s.length()
```

のように、**既存メソッドを1つ呼ぶだけ**ならメソッド参照。

```java
String::length
```

一方で、

```java
s -> s.trim().toUpperCase()
```

のように、**複数の処理・条件・計算がある**ならラムダ式。

無理にメソッド参照へ変換する必要はありません。読みやすくなる場合だけ使えば十分です。
