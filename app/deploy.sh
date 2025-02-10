cd "$(dirname "$0")"

# 削除
rm -rf dist
mkdir dist

# build
docker compose -f "../compose.yaml" run --rm node bash -c "npm run postinstall && npm run generate"

# build結果をコピー
cp -r .output/public/ dist

gcloud app deploy app.yaml