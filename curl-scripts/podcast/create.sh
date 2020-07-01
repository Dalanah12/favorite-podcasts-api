
curl "http://localhost:4741/podcasts" \
--include \
--request POST \
--header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
  "podcast": {
    "title": "'"${TITLE}"'",
    "hosts": "'"${HOST}"'",
    "topic": "'"${TOPIC}"'",
    "rating": "'"${RATE}"'"
  }
}'

echo
