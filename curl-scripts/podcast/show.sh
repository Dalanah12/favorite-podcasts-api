curl "http://localhost:4741/podcasts/${ID}" \
--include \
--request GET \
--header "Authorization: Bearer ${TOKEN}"

echo
