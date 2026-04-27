import paramiko
import os
import time

host = '112.78.143.92'
port = 22
username = 'ubuntu'
password = 'Jakarta2026%@'

remote_dir = '/www/wwwroot/sman78-jkt.sch.id/dist'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, port=port, username=username, password=password)

# Remove old files using sudo
stdin, stdout, stderr = client.exec_command(f"sudo rm -rf {remote_dir}/*")
print(stdout.read().decode())
print(stderr.read().decode())

# Upload index.html via sftp
sftp = client.open_sftp()
print("Uploading index.html...")
sftp.put('dist/index.html', f'{remote_dir}/index.html')

# Upload assets one by one
print("Uploading assets...")
for filename in os.listdir('dist/assets'):
    local_path = f'dist/assets/{filename}'
    remote_path = f'{remote_dir}/assets/{filename}'
    sftp.put(local_path, remote_path)
    print(f"  uploaded {filename}")

sftp.close()
client.close()
print("Done!")