# Download professional sonography images
Write-Host "Downloading sonography images..."

$url1 = 'https://images.unsplash.com/photo-1631217314831-573701886326?w=1200&h=800&fit=crop'
Invoke-WebRequest -Uri $url1 -OutFile 'sonography-technician.jpg' -ErrorAction SilentlyContinue
Write-Host "Downloaded: sonography-technician.jpg"

$url2 = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop'
Invoke-WebRequest -Uri $url2 -OutFile 'ultrasound-probe.jpg' -ErrorAction SilentlyContinue
Write-Host "Downloaded: ultrasound-probe.jpg"

$url3 = 'https://images.unsplash.com/photo-1579154204601-01d5d08ba33f?w=1200&h=800&fit=crop'
Invoke-WebRequest -Uri $url3 -OutFile 'sonography-patient.jpg' -ErrorAction SilentlyContinue
Write-Host "Downloaded: sonography-patient.jpg"

Write-Host "Complete!"
Get-ChildItem *.jpg
