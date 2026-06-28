Stream APIでよく使われるものは、主に次の操作です。

大きく分けると、Stream APIには **中間操作** と **終端操作** があります。

```java
list.stream()
    .filter(...)
    .map(...)
    .collect(...);
```

この場合、

```java
filter(...)
map(...)
```

は中間操作、

```java
collect(...)
```

は終端操作です。

---

# 1. `filter`：条件で絞り込む

一番よく使います。

```java
List<String> names = Arrays.asList("Tanaka", "", "Suzuki");

List<String> result = names.stream()
        .filter(s -> !s.isEmpty())
        .collect(Collectors.toList());
```

意味は、

```java
空文字でないものだけ残す
```

です。

オブジェクトの場合は、こうです。

```java
List<Item> result = items.stream()
        .filter(item -> item.getCount() > 0)
        .collect(Collectors.toList());
```

---

# 2. `map`：別の値に変換する

リストの中身を別の形に変換します。

```java
List<String> names = Arrays.asList("Tanaka", "Suzuki");

List<Integer> lengths = names.stream()
        .map(s -> s.length())
        .collect(Collectors.toList());
```

これは、

```java
String のリスト → 文字数のリスト
```

に変換しています。

メソッド参照ならこうです。

```java
List<Integer> lengths = names.stream()
        .map(String::length)
        .collect(Collectors.toList());
```

オブジェクトから名前だけ取り出す場合もよくあります。

```java
List<String> names = users.stream()
        .map(user -> user.getName())
        .collect(Collectors.toList());
```

メソッド参照なら、

```java
List<String> names = users.stream()
        .map(User::getName)
        .collect(Collectors.toList());
```

---

# 3. `collect`：結果をリストなどにまとめる

Streamの結果を `List` や `Set` に戻すときによく使います。

```java
List<String> result = list.stream()
        .filter(s -> !s.isEmpty())
        .collect(Collectors.toList());
```

`Set` にする場合です。

```java
Set<String> result = list.stream()
        .collect(Collectors.toSet());
```

Java 8では、基本的にこの書き方を使います。

```java
.collect(Collectors.toList())
```

Java 16以降なら、次のようにも書けます。

```java
.toList()
```

ただし、Java 8を使っているなら `Collectors.toList()` を使ってください。

---

# 4. `forEach`：1件ずつ処理する

各要素に対して処理を行います。

```java
List<String> names = Arrays.asList("Tanaka", "Suzuki");

names.stream()
        .forEach(s -> System.out.println(s));
```

短く書くなら、

```java
names.forEach(System.out::println);
```

ただし、`forEach` は **表示・ログ出力・簡単な処理** には使いますが、複雑な更新処理にはあまり向きません。

---

# 5. `sorted`：並び替える

自然順で並び替える場合です。

```java
List<String> result = names.stream()
        .sorted()
        .collect(Collectors.toList());
```

オブジェクトを特定の項目で並び替える場合です。

```java
List<User> result = users.stream()
        .sorted(Comparator.comparing(User::getAge))
        .collect(Collectors.toList());
```

降順にする場合です。

```java
List<User> result = users.stream()
        .sorted(Comparator.comparing(User::getAge).reversed())
        .collect(Collectors.toList());
```

複数条件で並び替える場合です。

```java
List<User> result = users.stream()
        .sorted(
            Comparator.comparing(User::getAge)
                      .thenComparing(User::getName)
        )
        .collect(Collectors.toList());
```

---

# 6. `distinct`：重複を取り除く

```java
List<String> values = Arrays.asList("A", "B", "A", "C");

List<String> result = values.stream()
        .distinct()
        .collect(Collectors.toList());
```

結果は、

```java
[A, B, C]
```

です。

ただし、独自クラスで `distinct()` を使う場合は、`equals()` と `hashCode()` が適切に実装されている必要があります。

---

# 7. `count`：件数を数える

```java
long count = users.stream()
        .filter(user -> user.getAge() >= 20)
        .count();
```

これは、

```java
20歳以上のユーザー数
```

を数えています。

---

# 8. `anyMatch` / `allMatch` / `noneMatch`：条件判定

## 1件でも条件に合うか

```java
boolean exists = users.stream()
        .anyMatch(user -> user.getAge() >= 20);
```

意味は、

```java
20歳以上のユーザーが1人でもいるか
```

です。

## 全件が条件に合うか

```java
boolean allAdult = users.stream()
        .allMatch(user -> user.getAge() >= 20);
```

## 1件も条件に合わないか

```java
boolean none = users.stream()
        .noneMatch(user -> user.getAge() < 0);
```

---

# 9. `findFirst`：最初の1件を取得する

```java
Optional<User> user = users.stream()
        .filter(u -> u.getName().equals("Tanaka"))
        .findFirst();
```

戻り値は `Optional<User>` です。

使うときは、例えばこう書きます。

```java
User user = users.stream()
        .filter(u -> u.getName().equals("Tanaka"))
        .findFirst()
        .orElse(null);
```

または、存在する場合だけ処理します。

```java
users.stream()
        .filter(u -> u.getName().equals("Tanaka"))
        .findFirst()
        .ifPresent(u -> System.out.println(u.getName()));
```

---

# 10. `mapToInt` / `sum`：数値の合計

数値計算ではよく使います。

```java
int total = items.stream()
        .mapToInt(item -> item.getCount())
        .sum();
```

メソッド参照なら、

```java
int total = items.stream()
        .mapToInt(Item::getCount)
        .sum();
```

平均を出す場合です。

```java
double average = items.stream()
        .mapToInt(Item::getCount)
        .average()
        .orElse(0);
```

最大値です。

```java
int max = items.stream()
        .mapToInt(Item::getCount)
        .max()
        .orElse(0);
```

最小値です。

```java
int min = items.stream()
        .mapToInt(Item::getCount)
        .min()
        .orElse(0);
```

---

# 11. `reduce`：集約する

合計なら `sum()` の方が読みやすいですが、`reduce` もよく出てきます。

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

int total = numbers.stream()
        .reduce(0, (a, b) -> a + b);
```

これは、

```java
0から始めて、順番に足していく
```

という意味です。

メソッド参照なら、

```java
int total = numbers.stream()
        .reduce(0, Integer::sum);
```

---

# 12. `groupingBy`：グループ化する

実務でかなり使います。

例えば、部署ごとにユーザーをまとめる場合です。

```java
Map<String, List<User>> usersByDepartment = users.stream()
        .collect(Collectors.groupingBy(User::getDepartment));
```

結果のイメージは、

```java
{
  "営業部" = [User1, User2],
  "開発部" = [User3, User4]
}
```

件数を数える場合です。

```java
Map<String, Long> countByDepartment = users.stream()
        .collect(Collectors.groupingBy(
                User::getDepartment,
                Collectors.counting()
        ));
```

---

# 13. `toMap`：Mapに変換する

IDをキーにして、オブジェクトをMapにする場合です。

```java
Map<Integer, User> userMap = users.stream()
        .collect(Collectors.toMap(
                User::getId,
                user -> user
        ));
```

意味は、

```java
ID → User
```

のMapを作る、ということです。

ただし、キーが重複すると例外になります。

重複時に後の値で上書きするなら、こう書きます。

```java
Map<Integer, User> userMap = users.stream()
        .collect(Collectors.toMap(
                User::getId,
                user -> user,
                (oldValue, newValue) -> newValue
        ));
```

---

# 14. `limit` / `skip`：件数制限・読み飛ばし

先頭3件だけ取得します。

```java
List<User> result = users.stream()
        .limit(3)
        .collect(Collectors.toList());
```

先頭3件を飛ばします。

```java
List<User> result = users.stream()
        .skip(3)
        .collect(Collectors.toList());
```

ページングのような処理で使うことがあります。

```java
int page = 2;
int size = 10;

List<User> result = users.stream()
        .skip((page - 1) * size)
        .limit(size)
        .collect(Collectors.toList());
```

---

# 15. `flatMap`：入れ子のリストを平らにする

少し難しいですが、よく使われます。

```java
List<List<String>> nested = Arrays.asList(
        Arrays.asList("A", "B"),
        Arrays.asList("C", "D")
);

List<String> result = nested.stream()
        .flatMap(list -> list.stream())
        .collect(Collectors.toList());
```

結果は、

```java
[A, B, C, D]
```

です。

つまり、

```java
List<List<String>>
```

を

```java
List<String>
```

に平らにしています。

---

# よく使う組み合わせ

## 条件で絞って、名前だけ取り出す

```java
List<String> names = users.stream()
        .filter(user -> user.getAge() >= 20)
        .map(User::getName)
        .collect(Collectors.toList());
```

---

## 条件に合う件数を数える

```java
long count = users.stream()
        .filter(user -> user.getAge() >= 20)
        .count();
```

---

## 条件に合うデータの合計を出す

```java
int total = items.stream()
        .filter(item -> item.getId().equals(targetId))
        .mapToInt(Item::getCount)
        .sum();
```

---

## 日時が現在から5分以内のデータだけ合計する

```java
LocalDateTime now = LocalDateTime.now();

int total = items.stream()
        .filter(item -> item.getId().equals(targetId))
        .filter(item -> item.getDateTime().isAfter(now.minusMinutes(5)))
        .mapToInt(Item::getCount)
        .sum();
```

---

# 覚える優先順位

最初はこれだけ覚えれば十分です。

| 操作                 | 用途              |
| ------------------ | --------------- |
| `filter`           | 条件で絞る           |
| `map`              | 値を変換する          |
| `collect`          | ListやSetに戻す     |
| `forEach`          | 1件ずつ処理する        |
| `sorted`           | 並び替える           |
| `count`            | 件数を数える          |
| `anyMatch`         | 条件に合うものがあるか判定する |
| `findFirst`        | 最初の1件を取得する      |
| `mapToInt().sum()` | 合計する            |
| `groupingBy`       | グループ化する         |
| `toMap`            | Mapに変換する        |

特に実務では、

```java
filter → map → collect
```

と

```java
filter → mapToInt → sum
```

が非常によく出ます。

Stream APIは、基本的に **「リストを流して、絞る・変換する・集計する」ための仕組み** と考えると理解しやすいです。
