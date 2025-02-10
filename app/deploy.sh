cd "$(dirname "$0")"

# 削除
rm -rf dist
mkdir dist

# build結果をコピー
cp -r .output/public/ dist

gcloud app deploy app.yaml