import paramiko
import os
import sys

host = '112.78.143.92'
port = 22
username = 'ubuntu'
password = 'Jakarta2026%@'

local_dir = 'dist'
temp_dir = '/tmp/deploy_sman40'
remote_dir = '/www/wwwroot/sman40-jkt.sch.id'

if not os.path.exists(local_dir):
    print(f"Error: {local_dir} not found. Run 'npm run build' first.")
    sys.exit(1)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, port=port, username=username, password=password)

# Create temp dir
stdin, stdout, stderr = client.exec_command(f"mkdir -p {temp_dir} && rm -rf {temp_dir}/*")
print(stdout.read().decode())

sftp = client.open_sftp()
print("Uploading official web files to temp...")

for root, dirs, files in os.walk(local_dir):
    for filename in files:
        local_path = os.path.join(root, filename)
        arc_path = os.path.relpath(local_path, local_dir).replace(os.sep, '/')
        remote_path = f"{temp_dir}/{arc_path}"
        subdir = os.path.dirname(arc_path)
        if subdir:
            parts = subdir.split('/')
            cur = temp_dir
            for p in parts:
                cur = f"{cur}/{p}"
                try:
                    sftp.stat(cur)
                except:
                    try:
                        sftp.mkdir(cur)
                    except:
                        pass
        sftp.put(local_path, remote_path)
        print(f"  uploaded {arc_path}")

sftp.close()

# Move from temp to remote
print("\nMoving files to final location...")
stdin, stdout, stderr = client.exec_command(f"sudo cp -rT {temp_dir} {remote_dir} && sudo chown -R www-data:www-data {remote_dir}")
print(stdout.read().decode())
err = stderr.read().decode()
if err: print("STDERR:", err)

client.close()
print("\nDone! Official web deployed to:", remote_dir)
