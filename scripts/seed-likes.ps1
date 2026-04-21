$token = gcloud auth print-access-token
$project = "citard-fbc26"
$base = "https://firestore.googleapis.com/v1/projects/$project/databases/(default)/documents"
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
$target = "je1HdwssPigxtDyHKZpkXNMOGY32"
$now = [long]([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())

# Fake user profiles
$users = @(
  @{ id="test_valentina_001"; name="Valentina Cruz"; age=24; bio="Amante de la musica y los viajes"; location="Santo Domingo Este"; img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop"; interests=@("Musica","Viajes","Arte") },
  @{ id="test_mariana_002"; name="Mariana Perez"; age=26; bio="Deportista y cocinera"; location="Piantini"; img="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop"; interests=@("Deportes","Cocina","Cine") },
  @{ id="test_isabella_003"; name="Isabella Mendez"; age=23; bio="Artista y lectora"; location="Naco"; img="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop"; interests=@("Arte","Lectura","Yoga") },
  @{ id="test_sofia_004"; name="Sofia Reyes"; age=27; bio="Bailarina y foodie"; location="Bella Vista"; img="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop"; interests=@("Musica","Baile","Gastronomia") }
)

foreach ($u in $users) {
  $interestsArr = ($u.interests | ForEach-Object { '{"stringValue":"' + $_ + '"}' }) -join ","
  $body = @"
{"fields":{"id":{"stringValue":"$($u.id)"},"name":{"stringValue":"$($u.name)"},"age":{"integerValue":"$($u.age)"},"bio":{"stringValue":"$($u.bio)"},"location":{"stringValue":"$($u.location)"},"images":{"arrayValue":{"values":[{"stringValue":"$($u.img)"}]}},"interests":{"arrayValue":{"values":[$interestsArr]}},"gender":{"stringValue":"mujer"},"isVerified":{"booleanValue":true}}}
"@
  $url = "$base/perfiles/$($u.id)"
  try {
    Invoke-RestMethod -Uri $url -Method Patch -Headers $headers -Body $body | Out-Null
    Write-Host "Profile: $($u.name)" -ForegroundColor Green
  } catch { Write-Host "Error profile $($u.name): $_" -ForegroundColor Red }
}

# Create likes
$i = 0
foreach ($u in $users) {
  $ts = $now - ($i * 3600000)
  $isSuperLike = if ($i -eq 0) { "true" } else { "false" }
  $likeId = "$($u.id)_$target"
  $body = @"
{"fields":{"fromUserId":{"stringValue":"$($u.id)"},"toUserId":{"stringValue":"$target"},"timestamp":{"integerValue":"$ts"},"isSuperLike":{"booleanValue":$isSuperLike}}}
"@
  $url = "$base/likes/$likeId"
  try {
    Invoke-RestMethod -Uri $url -Method Patch -Headers $headers -Body $body | Out-Null
    $type = if ($isSuperLike -eq "true") { "SUPER LIKE" } else { "like" }
    Write-Host "Like: $($u.name) -> Luis ($type)" -ForegroundColor Cyan
  } catch { Write-Host "Error like $($u.name): $_" -ForegroundColor Red }
  $i++
}

Write-Host "`nDone! Go to tapati.online > Te dieron like" -ForegroundColor Yellow
