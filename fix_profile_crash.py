import re

with open('src/views/ProfileView.tsx', 'r') as f:
    content = f.read()

# For MainProfile
content = re.sub(
    r'function MainProfile\(\{ setSubView, avatarUrl, setAvatarUrl, userName, contactsCount, onLogout \}: \{ setSubView: \(v: SubView\) => void, avatarUrl: string \| null, setAvatarUrl: \(url: string\) => void, userName: string, contactsCount: number, onLogout\?: \(\) => void \}\) \{',
    r'function MainProfile({ setSubView, avatarUrl, setAvatarUrl, userName, contactsCount, onLogout, isDinoTheme }: { setSubView: (v: SubView) => void, avatarUrl: string | null, setAvatarUrl: (url: string) => void, userName: string, contactsCount: number, onLogout?: () => void, isDinoTheme?: boolean }) {',
    content
)

# For SupportNetwork
content = re.sub(
    r'function SupportNetwork\(\{ setSubView, contacts, setContacts, hasTherapist, setHasTherapist \}: \{ setSubView: \(v: SubView\) => void, contacts: any\[\], setContacts: \(c: any\[\]\) => void, hasTherapist: boolean, setHasTherapist: \(v: boolean\) => void \}\) \{',
    r'function SupportNetwork({ setSubView, contacts, setContacts, hasTherapist, setHasTherapist, isDinoTheme }: { setSubView: (v: SubView) => void, contacts: any[], setContacts: (c: any[]) => void, hasTherapist: boolean, setHasTherapist: (v: boolean) => void, isDinoTheme?: boolean }) {',
    content
)

# For AboutYou
content = re.sub(
    r'function AboutYou\(\{ setSubView, userName, setUserName, onSaveToDiary \}: \{ setSubView: \(v: SubView\) => void, userName: string, setUserName: \(v: string\) => void, onSaveToDiary\?: \(\) => void \}\) \{',
    r'function AboutYou({ setSubView, userName, setUserName, onSaveToDiary, isDinoTheme }: { setSubView: (v: SubView) => void, userName: string, setUserName: (v: string) => void, onSaveToDiary?: () => void, isDinoTheme?: boolean }) {',
    content
)

# Call sites
content = content.replace(
    '<MainProfile setSubView={setSubView} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} userName={userName} contactsCount={contacts.length} onLogout={onLogout} />',
    '<MainProfile setSubView={setSubView} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} userName={userName} contactsCount={contacts.length} onLogout={onLogout} isDinoTheme={isDinoTheme} />'
)
content = content.replace(
    '<SupportNetwork setSubView={setSubView} contacts={contacts} setContacts={setContacts} hasTherapist={hasTherapist} setHasTherapist={setHasTherapist} />',
    '<SupportNetwork setSubView={setSubView} contacts={contacts} setContacts={setContacts} hasTherapist={hasTherapist} setHasTherapist={setHasTherapist} isDinoTheme={isDinoTheme} />'
)
content = content.replace(
    '<AboutYou setSubView={setSubView} userName={userName} setUserName={setUserName} onSaveToDiary={onSaveToDiary} />',
    '<AboutYou setSubView={setSubView} userName={userName} setUserName={setUserName} onSaveToDiary={onSaveToDiary} isDinoTheme={isDinoTheme} />'
)

with open('src/views/ProfileView.tsx', 'w') as f:
    f.write(content)
