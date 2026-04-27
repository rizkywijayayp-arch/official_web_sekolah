import paramiko
import os
import time

host = '112.78.143.92'
port = 22
username = 'ubuntu'
password = 'Jakarta2026%@'

# Local dist zip path
local_zip = 'd:/nayaka/official_web_sekolah/dist.zip'
remote_zip = '/tmp/official_web_sekolah.zip'
remote_dir = '/www/wwwroot/official_web_sekolah'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, port=port, username=username, password=password)

sftp = client.open_sftp()

# Upload zip
print("Uploading dist.zip...")
sftp.put(local_zip, remote_zip)

# Extract and deploy
print("Deploying...")
commands = [
    f"cd {remote_dir} && unzip -o {remote_zip} -d .",
    f"rm {remote_zip}",
    "ls -la"
]

for cmd in commands:
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode())
    err = stderr.read().decode()
    if err:
        print("STDERR:", err)
    time.sleep(0.5)

sftp.close()
client.close()
print("Deployment complete!")