deploy_host="kvqa.crowdbank.co.kr"
deploy_id="kvqa"
deploy_pw="kvqa220427!"

lftp -u "${deploy_id}:${deploy_pw}" ftp://${deploy_host} -p 21 -e "set file:charset utf-8; set net:timeout 5; set net:max-retries 2; set net:reconnect-interval-base 5; mirror -R -v -c -n -P 10 -x .git ./dist /t; exit;"