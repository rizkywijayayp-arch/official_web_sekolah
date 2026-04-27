import paramiko
import os
import time

host = '112.78.143.92'
port = 22
username = 'ubuntu'
password = 'Jakarta2026%@'

local_zip = 'd:/nayaka/official_web_sekolah/dist.zip'
remote_zip = '/tmp/sman78_dist.zip'
remote_dir = '/www/wwwroot/sman78-jkt.sch.id/dist'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, port=port, username=username, password=password)

sftp = client.open_sftp()

# Upload zip
print("Uploading dist.zip...")
sftp.put(local_zip, remote_zip)

# Remove old assets first with sudo, then extract
commands = [
    f"sudo rm -rf {remote_dir}/assets/*",
    f"sudo rm -f {remote_dir}/index.html",
    f"cd {remote_dir} && unzip -o {remote_zip}",
    f"sudo chown -R www-data:www-data {remote_dir}",
    f"rm {remote_zip}",
    f"ls -la {remote_dir}/assets/"
]

for cmd in commands:
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode())
    err = stderr.read().decode()
    if err and 'warning' not in err.lower():
        print("STDERR:", err)
    time.sleep(0.5)

sftp.close()
client.close()
print("Deployment complete!")