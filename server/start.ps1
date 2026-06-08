Set-Location "D:\NanoDegree\ProfisionalReact\glow-fix\server"
$env:DATABASE_URL="postgresql://glowfix:glowfix_dev_password@172.20.152.175:5432/glowfix_dev?schema=public"
node dist/main.js
