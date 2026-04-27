import paramiko
import os
import time

host = '112.78.143.92'
port = 22
username = 'ubuntu'
password = 'Jakarta2026%@'

# Use a temp directory first, then move
temp_dir = '/tmp/deploy_sman78'
remote_dir = '/www/wwwroot/sman78-jkt.sch.id/dist'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, port=port, username=username, password=password)

# Create temp dir
stdin, stdout, stderr = client.exec_command(f"mkdir -p {temp_dir} && rm -rf {temp_dir}/*")
print(stdout.read().decode())

# Upload files via sftp to temp
sftp = client.open_sftp()
print("Uploading files to temp dir...")

for root, dirs, files in os.walk('dist'):
    for filename in files:
        local_path = os.path.join(root, filename)
        arc_path = os.path.relpath(local_path, 'dist').replace(os.sep, '/')
        remote_path = f"{temp_dir}/{arc_path}"
        # Create subdirs if needed
        subdir = os.path.dirname(arc_path)
        if subdir:
            try:
                sftp.stat(f"{temp_dir}/{subdir}")
            except:
                # Create dir
                parts = subdir.split('/')
                cur = temp_dir
                for p in parts:
                    cur = f"{cur}/{p}"
                    try:
                        sftp.mkdir(cur)
                    except:
                        pass

        sftp.put(local_path, remote_path)
        print(f"  uploaded {arc_path}")

sftp.close()

# Move from temp to remote
print("Moving files...")
stdin, stdout, stderr = client.exec_command(f"sudo rm -rf {remote_dir}/* && sudo cp -r {temp_dir}/* {remote_dir}/ && sudo chown -R www-data:www-data {remote_dir}")
print(stdout.read().decode())
print(stderr.read().decode())

client.close()
print("Done!")