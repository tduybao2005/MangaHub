# MangaHub

App đọc truyện tranh viết bằng React Native (Expo). Danh sách truyện, chương và link ảnh nằm trong
file `data/manga.json`; app gọi file này qua GitHub như một API (GET bằng Axios).

## Chạy app

```bash
npm install
npx expo start      # quét QR bằng Expo Go, hoặc bấm "a" để mở máy ảo Android
```

> App đọc dữ liệu từ nhánh `main` trên GitHub, nên sau khi sửa `data/manga.json` cần push lên thì app mới thấy.

## Cấu trúc thư mục

```
app/                     // Expo Router: mỗi file là 1 màn hình
  _layout.js             // Stack gốc + bọc Context
  (tabs)/
    _layout.js           // Tabs: Trang chủ · Tìm kiếm · Yêu thích
    index.js             // Trang chủ: danh sách bộ truyện
    search.js            // Tìm truyện theo tên / tác giả
    favorites.js         // Truyện đã thích
  detail.js              // Chi tiết 1 bộ truyện + danh sách chương
  reader.js              // Đọc 1 chương: cuộn dọc các trang, chuyển chương trước / sau
api/client.js            // Axios instance (baseURL, timeout)
hooks/useFetch.js        // Custom hook Loading – Data – Error
context/
  MangaContext.js        // Gọi API 1 lần, chia sẻ danh sách truyện cho mọi màn hình
  FavoritesContext.js    // Danh sách truyện yêu thích
components/              // SeriesItem, LoadingView / ErrorView
constants/colors.js      // Màu dùng chung
data/
  manga.json             // "API": danh sách truyện -> chương -> trang
  images/                // Ảnh các truyện đã hết bản quyền (lấy từ Wikimedia Commons)
```

## Cấu trúc dữ liệu (`data/manga.json`)

```json
{
  "series": [
    {
      "id": "little-nemo",
      "title": "Little Nemo in Slumberland",
      "author": "Winsor McCay",
      "year": "1905",
      "language": "Tiếng Anh",
      "license": "Public domain",
      "source": "https://commons.wikimedia.org/...",
      "description": "...",
      "cover": "https://...",
      "chapters": [
        {
          "id": "little-nemo-1",
          "number": 1,
          "title": "Ngày 15/10/1905",
          "pages": [{ "url": "https://...", "width": 960, "height": 1311 }]
        }
      ]
    }
  ]
}
```

`width` / `height` là kích thước ảnh, dùng để hiển thị trang đúng tỉ lệ (`aspectRatio`).

## Nguồn truyện và giấy phép

| Truyện | Tác giả | Giấy phép | Nguồn ảnh |
|---|---|---|---|
| Pepper&Carrot | David Revoy | CC BY 4.0 | peppercarrot.com |
| Little Nemo in Slumberland | Winsor McCay | Public domain | Wikimedia Commons |
| Krazy Kat | George Herriman | Public domain | Wikimedia Commons |
| Little Sammy Sneeze | Winsor McCay | Public domain | Wikimedia Commons |
| Buster Brown | Richard F. Outcault | Public domain | Wikimedia Commons |
| Der Struwwelpeter | Heinrich Hoffmann | Public domain | Wikimedia Commons |
| Bécassine | Caumery & J.-P. Pinchon | Public domain | Wikimedia Commons |
| xkcd | Randall Munroe | CC BY-NC 2.5 | xkcd.com |
