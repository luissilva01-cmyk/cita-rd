$token = gcloud auth print-access-token
$project = "citard-fbc26"
$base = "https://firestore.googleapis.com/v1/projects/$project/databases/(default)/documents"
$headers = @{ "Authorization" = "Bearer $token" }
$target = "je1HdwssPigxtDyHKZpkXNMOGY32"

$ids = @("test_valentina_001","test_mariana_002","test_isabella_003","test_sofia_004")

foreach ($id in $ids) {
  # Delete profile
  try {
    Invoke-RestMethod -Uri "$base/perfiles/$id" -Method Delete -Headers $headers | Out-Null
    Write-Host "Deleted profile: $id" -ForegroundColor Green
  } catch { Write-Host "Error deleting profile $id" -ForegroundColor Red }

  # Delete like
  $likeId = "${id}_$target"
  try {
    Invoke-RestMethod -Uri "$base/likes/$likeId" -Method Delete -Headers $headers | Out-Null
    Write-Host "Deleted like: $likeId" -ForegroundColor Green
  } catch { Write-Host "Error deleting like $likeId" -ForegroundColor Red }
}
Write-Host "`nCleanup done!" -ForegroundColor Yellow
