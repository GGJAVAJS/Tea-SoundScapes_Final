import re

with open('src/views/ProfileView.tsx', 'r') as f:
    content = f.read()

old_use_effect = """  useEffect(() => {
    if (permissionName === 'notifications' && 'Notification' in window) {
      setGranted(Notification.permission === 'granted');
    } else if (navigator.permissions && (permissionName === 'microphone' || permissionName === 'camera' || permissionName === 'geolocation')) {
       navigator.permissions.query({ name: permissionName as PermissionName }).then(res => {
         setGranted(res.state === 'granted');
         res.onchange = () => {
           setGranted(res.state === 'granted');
         };
       }).catch(() => {});
    }
  }, [permissionName]);"""

new_use_effect = """  useEffect(() => {
    const checkStatus = async () => {
      // Notificações
      if (permissionName === 'notifications' && 'Notification' in window) {
        setGranted(Notification.permission === 'granted');
      } 
      
      // Checagem segura multiplataforma (incluindo iOS/Safari)
      try {
        if (navigator.permissions) {
          const res = await navigator.permissions.query({ name: permissionName as PermissionName });
          setGranted(res.state === 'granted');
          res.onchange = () => setGranted(res.state === 'granted');
        }
      } catch (e) {
        // Fallback para Safari (iOS) que não suporta navigator.permissions para mic/cam
        if (permissionName === 'microphone' || permissionName === 'camera') {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const kind = permissionName === 'microphone' ? 'audioinput' : 'videoinput';
            const hasPermission = devices.some(d => d.kind === kind && d.label !== '');
            if (hasPermission) setGranted(true);
          } catch(err) {}
        }
      }
    };
    checkStatus();
  }, [permissionName]);"""

if old_use_effect in content:
    content = content.replace(old_use_effect, new_use_effect)
    with open('src/views/ProfileView.tsx', 'w') as f:
        f.write(content)
    print("Updated useEffect successfully.")
else:
    print("Could not find the old useEffect block.")
