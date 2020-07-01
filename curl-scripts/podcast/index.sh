curl "http://localhost:4741/podcasts" \
--include \
--request GET \
--header "Authorization: Bearer ${TOKEN}"

echo
