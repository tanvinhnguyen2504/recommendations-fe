# Phase 10 — Add a place

> Doc phase 8 · Release R2 · R2 ships after this.

## Goal

Let users grow the dataset, with a duplicate check that keeps it clean and a pending state that
is honest about moderation.

## Tasks

- [ ] Route `/add`, no bottom nav, header `×` + "Thêm quán mới".
- [ ] Entry points: the results CTA, the empty state, and Account › Đóng góp.
- [ ] `AddPlaceCta` card on Discover (dashed border): "Không thấy quán bạn biết?" + "Thêm quán
      mới".
- [ ] Field 1 — Tên quán*, with a live duplicate check: debounce 300ms against
      `GET /places/duplicates?name=&lat=&lng=`. Matches render in a tinted box "Có phải quán
      này? Đã có trong danh sách:", each with "Đúng quán này" (opens that place) and the hint
      "Nếu không phải, cứ tiếp tục nhé."
- [ ] Field 2 — Loại quán (Quán ăn / Cà phê segmented); switching resets the highlight chips.
- [ ] Field 3 — Địa chỉ*: location chip opening the location sheet, a "Số nhà, tên đường" input,
      and a 128px mini map with a centre pin ("Kéo bản đồ để ghim đúng cửa quán").
- [ ] Field 4 — Mức giá, 3 tiles, single-select.
- [ ] Field 5 — Đặc điểm nổi bật: cuisine chips for food, vibe chips for cafés, plus amenities.
- [ ] Field 6 — Giờ mở cửa: two `input type="time"`.
- [ ] Field 7 — Ảnh & video: dashed "Thêm" tile + previews, max 7, with helper text.
- [ ] Field 8 — Ghi chú textarea, optional.
- [ ] Footer: the hint 'Quán hiện ngay trong kết quả với nhãn "Chờ duyệt".' + "Gửi quán",
      disabled until name ≥ 2 and street ≥ 2 characters.
- [ ] Submit: upload media via presigned URLs, then `POST /place-submissions`.
- [ ] Success state: green check, explanation, "Xem quán vừa thêm" / "Về trang Khám phá".
- [ ] Optimistically insert the new place into the user's results with `status: 'pending'`.
- [ ] Split into 3 steps at ≤360px — name + duplicate check → address + pin → details + photos —
      with a progress indicator.
- [ ] Photo input uses `capture="environment"`; compress on-device to max 2048px before upload.

## Implementation notes

- The duplicate check is the quality mechanism for the whole dataset — it is why this phase is
  not just a form. Debounce the **value**, and never block submission on it: the hint
  "Nếu không phải, cứ tiếp tục nhé" exists because the check will produce false positives.
- Duplicate matching uses `normalizeVi` from phase 1, so "Quán Cô Ba" matches "quan co ba".
- On-device compression before upload is not optional on 4G: raw phone photos are 3–8 MB and
  users are on mobile data standing outside a restaurant.
- The 3-step split at ≤360px exists to reduce keyboard thrash, not to look like a wizard. Keep
  one form state across steps so going back never loses input.
- The optimistic `pending` insert is what makes the contribution feel real. It must be clearly
  labelled "Chờ duyệt" everywhere it appears, including the card and the detail.
- **This depends on a moderation back office that is not built here.** Submissions pile up
  unreviewed without it — confirm it exists before shipping R2.

## Verify

Typing an existing place's name surfaces it as a duplicate within ~300ms, and "Đúng quán này"
opens it. Submitting uploads the photos and the place appears immediately in results with a
"Chờ duyệt" pill. At 360px the form is 3 steps and going back preserves every field. A 6 MB
photo is compressed before upload (check the request payload size). **R2 ships here.**
