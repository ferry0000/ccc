失礼しました。分子が `d` なら、式は次の形です。

```text
a = ⌊ b × d / c ⌋
```

または、

```text
a = ⌊ (b * d) / c ⌋
```

という意味です。

## 記号の意味

```text
⌊ x ⌋
```

これは **床関数**、または **floor** です。

意味は、

```text
x 以下の最大の整数
```

です。

例：

```text
⌊ 7.8 ⌋  = 7
⌊ 7.0 ⌋  = 7
⌊ -7.8 ⌋ = -8
```

---

## Javaで小数計算として実装する場合

`b`, `d`, `c` が `double` の場合は、次のように書きます。

```java
public static double calc(double b, double d, double c) {
    if (c == 0) {
        throw new IllegalArgumentException("c must not be 0");
    }

    return Math.floor((b * d) / c);
}
```

使用例です。

```java
double b = 5;
double d = 3;
double c = 2;

double a = Math.floor((b * d) / c);

System.out.println(a); // 7.0
```

計算は、

```text
⌊ 5 × 3 / 2 ⌋
= ⌊ 15 / 2 ⌋
= ⌊ 7.5 ⌋
= 7
```

です。

---

## intで計算する場合

`b`, `d`, `c` がすべて `int` で、値が正の数だけなら、単純にこう書けます。

```java
int a = (b * d) / c;
```

Javaの整数除算は小数部分を捨てるため、正の数だけなら床関数と同じ結果になります。

```java
int b = 5;
int d = 3;
int c = 2;

int a = (b * d) / c;

System.out.println(a); // 7
```

ただし、掛け算結果が大きくなる可能性があるなら、`long` を使った方が安全です。

```java
long a = ((long) b * d) / c;
```

---

## 負の値もあり得る場合

注意点があります。Javaの整数除算は、**0方向への切り捨て**です。

```java
System.out.println(-15 / 2); // -7
```

しかし、床関数では、

```text
⌊ -15 / 2 ⌋
= ⌊ -7.5 ⌋
= -8
```

です。

負の値もあり得るなら、`Math.floorDiv()` を使います。

```java
int a = Math.floorDiv(b * d, c);
```

オーバーフロー対策をするなら `long` です。

```java
long a = Math.floorDiv((long) b * d, c);
```

---

## 結論

`b`, `d`, `c` が正の整数なら、これでよいです。

```java
int a = (b * d) / c;
```

より安全に書くなら、

```java
long a = ((long) b * d) / c;
```

負の値も考慮して、数学的な床関数として正確に実装するなら、

```java
long a = Math.floorDiv((long) b * d, c);
```

小数を含む計算なら、

```java
double a = Math.floor((b * d) / c);
```
