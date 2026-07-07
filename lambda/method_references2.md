データクラスの **getter** は、メソッド参照でよく次のように書けます。

```java
Item::getName
```

これは、ラムダ式で書くと次と同じ意味です。

```java
item -> item.getName()
```

つまり、**Item オブジェクトを1つ受け取り、その getter を呼ぶ**という意味です。

---

## 例：データクラスがある場合

```java
public class Item {
    private String id;
    private LocalDateTime dateTime;
    private int count;

    public String getId() {
        return id;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public int getCount() {
        return count;
    }
}
```

このようなクラスがあるとします。

---

## `getId()` を使う場合

ラムダ式：

```java
.map(item -> item.getId())
```

メソッド参照：

```java
.map(Item::getId)
```

例：

```java
List<String> ids = items.stream()
        .map(Item::getId)
        .collect(Collectors.toList());
```

これは、各 `Item` から `id` を取り出しています。

---

## `getDateTime()` を使う場合

ラムダ式：

```java
.map(item -> item.getDateTime())
```

メソッド参照：

```java
.map(Item::getDateTime)
```

例：

```java
List<LocalDateTime> dateTimes = items.stream()
        .map(Item::getDateTime)
        .collect(Collectors.toList());
```

---

## `getCount()` を使う場合

`count` が `int` の場合は、`mapToInt` でよく使います。

ラムダ式：

```java
.mapToInt(item -> item.getCount())
```

メソッド参照：

```java
.mapToInt(Item::getCount)
```

例：

```java
int total = items.stream()
        .mapToInt(Item::getCount)
        .sum();
```

これは、各 `Item` の `count` を取り出して合計しています。

---

## filter では getter をそのままメソッド参照にしにくい場合が多い

たとえば、次のような条件があります。

```java
.filter(item -> item.getId().equals(targetId))
```

これは単に `getId()` を呼ぶだけではなく、さらに `.equals(targetId)` で比較しています。

そのため、普通はラムダ式のまま書きます。

```java
.filter(item -> item.getId().equals(targetId))
```

ただし、`getId()` で取り出してから比較する形に分けることはできます。

```java
items.stream()
        .map(Item::getId)
        .filter(id -> id.equals(targetId))
        .collect(Collectors.toList());
```

ただしこの場合、元の `Item` ではなく `id` の Stream になるので注意が必要です。

---

## 並び替えでは getter のメソッド参照がよく使われる

```java
items.sort(Comparator.comparing(Item::getDateTime));
```

これは次と同じです。

```java
items.sort(Comparator.comparing(item -> item.getDateTime()));
```

`count` 順に並べるなら、

```java
items.sort(Comparator.comparingInt(Item::getCount));
```

---

## よく使う形

| やりたいこと  | ラムダ式                         | メソッド参照              |
| ------- | ---------------------------- | ------------------- |
| IDを取り出す | `item -> item.getId()`       | `Item::getId`       |
| 日時を取り出す | `item -> item.getDateTime()` | `Item::getDateTime` |
| 個数を取り出す | `item -> item.getCount()`    | `Item::getCount`    |
| 日時でソート  | `item -> item.getDateTime()` | `Item::getDateTime` |
| 個数でソート  | `item -> item.getCount()`    | `Item::getCount`    |

---

あなたが前に使っていたコードでいうと、

```java
int total = items.stream()
        .filter(item -> item.getId().equals(targetId))
        .filter(item -> !item.getDateTime().isBefore(fromTime))
        .filter(item -> !item.getDateTime().isAfter(targetTime))
        .mapToInt(Item::getCount)
        .sum();
```

この中の、

```java
.mapToInt(Item::getCount)
```

が getter のメソッド参照です。

意味は、

```java
.mapToInt(item -> item.getCount())
```

と同じです。

`Item::getCount` は、**Item オブジェクトから count を取り出す処理**を渡している、ということです。


<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>


`items` が **空のリスト** の場合、このコードはエラーになりません。

```java
List<LocalDateTime> dateTimes = items.stream()
        .map(Item::getDateTime)
        .collect(Collectors.toList());
```

結果として、`dateTimes` も **空のリスト** になります。

```java
System.out.println(dateTimes);        // []
System.out.println(dateTimes.size()); // 0
```

理由は、`items.stream()` に要素がないため、次の処理は一度も実行されないからです。

```java
.map(Item::getDateTime)
```

つまり、`Item::getDateTime` は1回も呼ばれません。

## 注意点

`items` が **空のリスト** なら問題ありません。

```java
List<Item> items = new ArrayList<>();
```

これはOKです。

しかし、`items` 自体が `null` の場合はエラーになります。

```java
List<Item> items = null;

List<LocalDateTime> dateTimes = items.stream()
        .map(Item::getDateTime)
        .collect(Collectors.toList());
```

この場合は、

```text
NullPointerException
```

になります。

## まとめ

| `items` の状態 | 結果                              |
| ----------- | ------------------------------- |
| 空のリスト `[]`  | `dateTimes` も空リスト `[]`          |
| `null`      | `NullPointerException`          |
| 要素あり        | 各 `Item` の `dateTime` を取り出したリスト |

安全に書くなら、基本的には `items` を `null` にせず、空リストで扱うのがよいです。
