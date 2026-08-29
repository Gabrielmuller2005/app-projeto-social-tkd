import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Screen = 'login' | 'forgotPassword' | 'create' | 'guardian' | 'studentForm' | 'guardianHome' | 'studentHome' | 'studentProfile' | 'classes' | 'attendance' | 'notices' | 'materials' | 'teacherHome' | 'studentsAdmin' | 'guardiansAdmin' | 'classesAdmin' | 'classForm' | 'beltForm' | 'noticeForm' | 'materialForm' | 'rollCall' | 'ranking' | 'settings';
type Go = (screen: Screen) => void;

// Cores principais do aplicativo.
const BLUE = '#0754ef';
const NAVY = '#06153b';
const MUTED = '#5b6680';
const BORDER = '#dce2ec';

// Nomes das telas exibidos no menu flutuante.
const labels: Record<Screen, string> = {
  login: 'Login', forgotPassword: 'Recuperar senha', create: 'Criar conta', guardian: 'Cadastro responsável', studentForm: 'Cadastro aluno', guardianHome: 'Início responsável',
  studentHome: 'Início aluno', classes: 'Aulas', attendance: 'Frequência', notices: 'Comunicados',
  studentProfile: 'Perfil do aluno', materials: 'Materiais', teacherHome: 'Início professor', studentsAdmin: 'Gerenciar alunos', guardiansAdmin: 'Gerenciar responsáveis', classesAdmin: 'Gerenciar turmas', classForm: 'Cadastrar aula', beltForm: 'Graduação e faixas', noticeForm: 'Publicar comunicado', materialForm: 'Publicar material', rollCall: 'Lista de presença', ranking: 'Ranking', settings: 'Configurações',
};

export default function App() {
  // Controla a tela atual e o botão de voltar.
  const [screen, setScreen] = useState<Screen>('login');
  const [history, setHistory] = useState<Screen[]>([]);
  const go: Go = (next) => { setHistory((value) => [...value, screen]); setScreen(next); };
  const back = () => { setScreen(history.at(-1) ?? 'login'); setHistory((value) => value.slice(0, -1)); };
  const screens: Record<Screen, React.ReactNode> = {
    login: <Login go={go} />, forgotPassword: <ForgotPassword go={go} back={back} />, create: <Create go={go} back={back} />, guardian: <Guardian go={go} back={back} />,
    studentForm: <StudentForm go={go} back={back} />, guardianHome: <GuardianHome go={go} />, studentHome: <StudentHome go={go} />, studentProfile: <StudentProfile go={go} back={back} />, classes: <Classes go={go} back={back} />,
    attendance: <Attendance go={go} back={back} />, notices: <Notices go={go} />, materials: <Materials go={go} back={back} />,
    teacherHome: <TeacherHome go={go} />, studentsAdmin: <StudentsAdmin go={go} back={back} />, guardiansAdmin: <GuardiansAdmin go={go} back={back} />, classesAdmin: <ClassesAdmin go={go} back={back} />, classForm: <ClassForm go={go} back={back} />, beltForm: <BeltForm go={go} back={back} />, noticeForm: <NoticeForm go={go} back={back} />, materialForm: <MaterialForm go={go} back={back} />, rollCall: <RollCall go={go} back={back} />, ranking: <Ranking go={go} back={back} />, settings: <Settings go={go} back={back} />,
  };
  // Estrutura principal do aplicativo.
  return <SafeAreaView style={s.safe}><StatusBar style="dark" /><View style={s.app}>{screens[screen]}</View><DemoMenu current={screen} go={go} /></SafeAreaView>;
}

// Tela de login.
function Login({ go }: { go: Go }) {
  return <Page><View style={s.logo}><Text style={s.logoIcon}>🥋</Text><Text style={s.logoText}>IMPACTO SOCIAL</Text><Text style={s.logoSub}>OFICINA DE TAEKWONDO</Text></View><Title center>Bem-vindo!</Title><Text style={s.centerText}>Acompanhe, evolua e faça parte dessa grande família.</Text><Input placeholder="Telefone" keyboardType="phone-pad" /><Input placeholder="Senha" secureTextEntry /><Primary label="Entrar como aluno" onPress={() => go('studentHome')} /><Link label="Entrar como responsável (demonstração)" onPress={() => go('guardianHome')} /><Link label="Entrar como professor (demonstração)" onPress={() => go('teacherHome')} /><Link label="Esqueceu sua senha?" onPress={() => go('forgotPassword')} /><Text style={s.centerText}>Não tem uma conta?</Text><Outline label="Criar conta" onPress={() => go('create')} /></Page>;
}

// Tela de recuperação de senha.
function ForgotPassword({ go, back }: Props) {
  const [sent, setSent] = useState(false);
  return <Page><Back onPress={back} /><Title>Recuperar senha</Title><Subtitle>Informe o telefone cadastrado para receber as instruções de recuperação.</Subtitle><Field label="Telefone *" placeholder="(00) 00000-0000" keyboardType="phone-pad" />{sent && <Feedback>Solicitação enviada. Confira suas mensagens.</Feedback>}<Primary label="Enviar instruções" onPress={() => setSent(true)} /><Link label="Voltar para o login" onPress={() => go('login')} /></Page>;
}

// Tela de criação de conta.
function Create({ go, back }: Props) {
  const [type, setType] = useState<'student' | 'guardian'>('student');
  return <Page><Back onPress={back} /><Title>Criar conta</Title><Subtitle>Selecione o tipo de usuário:</Subtitle><Choice selected={type === 'student'} icon="●" title="SOU ALUNO" text="Acessar aulas, materiais, frequência e comunicados." onPress={() => setType('student')} /><Choice selected={type === 'guardian'} icon="●●" title="SOU RESPONSÁVEL" text="Cadastrar e acompanhar alunos vinculados." onPress={() => setType('guardian')} /><Primary label="Continuar" onPress={() => go(type === 'student' ? 'studentForm' : 'guardian')} /></Page>;
}

// Formulário de cadastro do responsável.
function Guardian({ go, back }: Props) {
  return <Form title="Cadastro de responsável" step="1 de 4" back={back}><Field label="Nome completo *" placeholder="Digite o nome completo" /><Field label="CPF *" placeholder="000.000.000-00" keyboardType="numeric" /><Field label="Telefone *" placeholder="(00) 00000-0000" keyboardType="phone-pad" /><Field label="E-mail" placeholder="nome@exemplo.com" keyboardType="email-address" autoCapitalize="none" /><Field label="Data de nascimento *" placeholder="dd/mm/aaaa" /><Field label="CEP" placeholder="00000-000" keyboardType="numeric" /><Field label="Endereço *" placeholder="Rua, número, bairro, cidade" /><Field label="Senha *" placeholder="Mínimo de 8 caracteres" secureTextEntry /><Field label="Confirmar senha *" placeholder="Repita a senha" secureTextEntry /><Outline label="＋ ADICIONAR ALUNO" onPress={() => go('studentForm')} /><Primary label="Salvar responsável" onPress={() => go('guardianHome')} /></Form>;
}

// Formulário de cadastro do aluno.
function StudentForm({ go, back }: Props) {
  return <Form title="Cadastro de aluno" step="2 de 4" back={back}><Field label="Nome completo *" placeholder="Digite o nome completo" /><Field label="CPF" placeholder="000.000.000-00" keyboardType="numeric" /><Field label="Telefone" placeholder="(00) 00000-0000" keyboardType="phone-pad" /><Field label="Data de nascimento *" placeholder="dd/mm/aaaa" /><Field label="Endereço *" placeholder="Rua, número, bairro, cidade" /><Field label="Responsável" placeholder="Selecione o responsável  ⌄" /><Field label="Turma" placeholder="Selecione a turma  ⌄" /><Field label="Faixa atual (opcional)" placeholder="Selecione a faixa  ⌄" /><Field label="Observações médicas" placeholder="Alergias, restrições ou cuidados" multiline numberOfLines={3} /><Primary label="Salvar aluno" onPress={() => go('studentHome')} /></Form>;
}

// Tela inicial do responsável.
function GuardianHome({ go }: { go: Go }) {
  return <StudentLayout go={go} current="guardianHome"><Title>Olá, responsável!</Title><Subtitle>Acompanhe os alunos vinculados à sua conta.</Subtitle><View style={s.profile}><Avatar /><View style={s.flex}><CardTitle>João Pedro</CardTitle><Text style={s.muted}>Turma: Juvenil • Faixa branca</Text><Link label="Ver dados do aluno ›" onPress={() => go('studentProfile')} /></View></View><View style={s.grid}><Menu icon="▣" label="Aulas" onPress={() => go('classes')} /><Menu icon="▥" label="Frequência" onPress={() => go('attendance')} /><Menu icon="◖" label="Comunicados" onPress={() => go('notices')} /><Menu icon="▤" label="Materiais" onPress={() => go('materials')} /></View><Outline label="＋ CADASTRAR OUTRO ALUNO" onPress={() => go('studentForm')} /></StudentLayout>;
}

// Tela inicial do aluno.
function StudentHome({ go }: { go: Go }) {
  return <StudentLayout go={go} current="studentHome"><Title>Olá, João Pedro!</Title><Subtitle>Acompanhe o seu desenvolvimento</Subtitle><View style={s.profile}><Avatar /><View style={s.flex}><CardTitle>João Pedro</CardTitle><Text style={s.muted}>Faixa atual: Branca - 10º gub</Text><Link label="Ver perfil ›" onPress={() => go('studentProfile')} /></View></View><View style={s.grid}><Menu icon="▣" label="Aulas" onPress={() => go('classes')} /><Menu icon="▥" label="Frequência" onPress={() => go('attendance')} /><Menu icon="◖" label="Comunicados" onPress={() => go('notices')} /><Menu icon="▤" label="Materiais" onPress={() => go('materials')} /></View><View style={s.motto}><Text style={s.mottoText}>DISCIPLINA HOJE,{`\n`}CONQUISTAS SEMPRE!</Text></View></StudentLayout>;
}

// Tela de perfil do aluno.
function StudentProfile({ go, back }: Props) {
  return <StudentLayout go={go} current="studentProfile"><Back onPress={back} /><Title>Perfil do aluno</Title><View style={s.profile}><Avatar /><View style={s.flex}><CardTitle>João Pedro</CardTitle><Text style={s.muted}>Aluno ativo</Text></View></View><Info label="Data de nascimento" value="15/03/2013" /><Info label="Responsável" value="Maria da Silva" /><Info label="Telefone" value="(51) 99999-0000" /><Info label="Turma" value="Juvenil - Terças e quintas" /><Info label="Faixa atual" value="Branca - 10º gub" /><Info label="Frequência" value="88%" /><Outline label="Editar dados" onPress={() => go('studentForm')} /></StudentLayout>;
}

// Tela com os horários das aulas.
function Classes({ go, back }: Props) {
  const data = [['Terça-feira', '18:00 às 19:30'], ['Quinta-feira', '18:00 às 19:30'], ['Sábado', '09:00 às 10:30']];
  return <StudentLayout go={go} current="classes"><Back onPress={back} /><Title>Aulas</Title><View style={s.tabs}><Text style={s.activeTab}>Próximas aulas</Text><Text style={s.tab}>Histórico</Text></View>{data.map(([day, time]) => <View style={s.listCard} key={day}><Icon>▣</Icon><View><CardTitle>{day}</CardTitle><CardTitle>{time}</CardTitle><Text style={s.muted}>Aula de Taekwondo</Text></View></View>)}</StudentLayout>;
}

// Tela de presenças, faltas e frequência.
function Attendance({ go, back }: Props) {
  return <StudentLayout go={go} current="classes"><Back onPress={back} /><Title>Frequência</Title><Field label="Faixa atual" value="Branca - 10º gub  ⌄" editable={false} /><Text style={s.section}>Resumo de frequência</Text><Stat label="Aulas realizadas" value="18" /><Stat label="Presenças" value="16" /><Stat label="Faltas" value="2" /><Stat label="Frequência" value="88%" green /><Primary label="Ver histórico completo" /></StudentLayout>;
}

// Tela de comunicados.
function Notices({ go }: { go: Go }) {
  const data = [['#e50914', 'Aula cancelada', '22/08/2026 • Aula de sábado', 'A aula deste sábado foi cancelada devido às chuvas.'], [BLUE, 'Materiais de estudo', '23/08/2026', 'Confira o material de estudo sobre as técnicas de chute.'], ['#f5a000', 'Observação aluno', '24/08/2026', 'Melhorar concentração nas aulas e treinar mais bases e técnicas de mão.']];
  return <StudentLayout go={go} current="notices"><Title>Comunicados</Title>{data.map(([color, title, date, body]) => <View style={s.notice} key={title}><View style={s.noticeHead}><View style={[s.dot, { backgroundColor: color }]} /><CardTitle>{title}</CardTitle><Text style={[s.badge, { backgroundColor: color }]}>Novo</Text></View><Text style={s.muted}>▣  {date}</Text><Text style={s.body}>{body}</Text><Link label="♡  Marcar como lido" /></View>)}</StudentLayout>;
}

// Tela de materiais de estudo.
function Materials({ go, back }: Props) {
  const files = [['Técnicas básicas', '2,4 MB'], ['Regras do Taekwondo', '1,1 MB'], ['Alongamentos', '1,8 MB'], ['Nomenclatura das faixas', '1,5 MB']];
  return <StudentLayout go={go} current="studentHome"><Back onPress={back} /><Title>Materiais de estudo</Title><Subtitle>Acesse os materiais enviados pelo professor.</Subtitle>{files.map(([name, size]) => <View style={s.file} key={name}><Icon>▤</Icon><View style={s.flex}><CardTitle>{name}</CardTitle><Text style={s.muted}>PDF • {size}</Text></View><Icon>⇩</Icon></View>)}</StudentLayout>;
}

// Tela inicial do professor.
function TeacherHome({ go }: { go: Go }) {
  return <TeacherLayout go={go} current="teacherHome"><Title>Olá, Professor!</Title><Subtitle>Gerencie as atividades do projeto.</Subtitle><View style={s.grid}><Menu icon="●●" label="Alunos" onPress={() => go('studentsAdmin')} /><Menu icon="▣" label="Turmas e aulas" onPress={() => go('classesAdmin')} /><Menu icon="✓" label="Presenças" onPress={() => go('rollCall')} /><Menu icon="⌁" label="Faixas" onPress={() => go('beltForm')} /><Menu icon="◖" label="Comunicados" onPress={() => go('noticeForm')} /><Menu icon="▤" label="Materiais" onPress={() => go('materialForm')} /><Menu icon="♛" label="Ranking" onPress={() => go('ranking')} /><Menu icon="⚙" label="Configurações" onPress={() => go('settings')} /></View><Outline label="Gerenciar responsáveis" onPress={() => go('guardiansAdmin')} /></TeacherLayout>;
}

// Tela de gerenciamento dos alunos.
function StudentsAdmin({ go, back }: Props) {
  return <TeacherLayout go={go} current="studentsAdmin"><Back onPress={back} /><Title>Alunos</Title><Input placeholder="Buscar por nome, turma ou faixa..." /><Primary label="＋ Cadastrar aluno" onPress={() => go('studentForm')} />{[['João Pedro', 'Juvenil • Faixa branca'], ['Camila Souza', 'Infantil • Faixa amarela'], ['Eduardo Lima', 'Adulto • Faixa azul']].map(([name, detail]) => <EntityRow key={name} title={name} detail={detail} onPress={() => go('studentProfile')} />)}</TeacherLayout>;
}

// Tela de gerenciamento dos responsáveis.
function GuardiansAdmin({ go, back }: Props) {
  return <TeacherLayout go={go} current="guardiansAdmin"><Back onPress={back} /><Title>Responsáveis</Title><Input placeholder="Buscar responsável..." /><Primary label="＋ Cadastrar responsável" onPress={() => go('guardian')} />{[['Maria da Silva', 'Responsável por João Pedro'], ['Carlos Souza', 'Responsável por Camila Souza'], ['Ana Lima', 'Responsável por Eduardo Lima']].map(([name, detail]) => <EntityRow key={name} title={name} detail={detail} onPress={() => go('guardian')} />)}</TeacherLayout>;
}

// Tela de gerenciamento das turmas e aulas.
function ClassesAdmin({ go, back }: Props) {
  return <TeacherLayout go={go} current="classesAdmin"><Back onPress={back} /><Title>Turmas e aulas</Title><Primary label="＋ Cadastrar turma/aula" onPress={() => go('classForm')} />{[['Turma Infantil', 'Terça e quinta • 17:00 às 18:00'], ['Turma Juvenil', 'Terça e quinta • 18:00 às 19:30'], ['Turma Adulto', 'Sábado • 09:00 às 10:30']].map(([name, detail]) => <EntityRow key={name} title={name} detail={detail} onPress={() => go('classForm')} />)}</TeacherLayout>;
}

// Formulário de cadastro de turma e aula.
function ClassForm({ go, back }: Props) {
  return <Form title="Cadastrar turma e aula" step="Gestão" back={back}><Field label="Nome da turma *" placeholder="Ex.: Turma Juvenil" /><Field label="Professor *" placeholder="Selecione o professor  ⌄" /><Field label="Dias da semana *" placeholder="Ex.: Terça e quinta" /><Field label="Horário inicial *" placeholder="18:00" keyboardType="numbers-and-punctuation" /><Field label="Horário final *" placeholder="19:30" keyboardType="numbers-and-punctuation" /><Field label="Data da próxima aula" placeholder="dd/mm/aaaa" /><Field label="Tema da aula" placeholder="Ex.: Técnicas básicas de chute" /><Field label="Observações" placeholder="Informações adicionais" multiline numberOfLines={3} /><Primary label="Salvar turma/aula" onPress={() => go('classesAdmin')} /></Form>;
}

// Formulário de graduação e faixas.
function BeltForm({ go, back }: Props) {
  return <Form title="Graduação e faixas" step="Gestão" back={back}><Field label="Aluno *" placeholder="Selecione o aluno  ⌄" /><Field label="Faixa atual" value="Branca - 10º gub" editable={false} /><Field label="Nova faixa *" placeholder="Selecione a nova faixa  ⌄" /><Field label="Data da graduação *" placeholder="dd/mm/aaaa" /><Field label="Professor avaliador" placeholder="Selecione o professor  ⌄" /><Field label="Observações" placeholder="Resultado da avaliação" multiline numberOfLines={4} /><Primary label="Registrar graduação" onPress={() => go('teacherHome')} /><Text style={s.section}>Faixas cadastradas</Text>{['Branca - 10º gub', 'Amarela - 9º gub', 'Verde - 7º gub', 'Azul - 5º gub', 'Vermelha - 2º gub', 'Preta - 1º dan'].map((belt) => <EntityRow key={belt} title={belt} detail="Editar ordem e descrição" />)}</Form>;
}

// Formulário de publicação de comunicado.
function NoticeForm({ go, back }: Props) {
  return <Form title="Publicar comunicado" step="Gestão" back={back}><Field label="Título *" placeholder="Título do comunicado" /><Field label="Categoria *" placeholder="Geral, aula, material ou aluno  ⌄" /><Field label="Público *" placeholder="Alunos, responsáveis ou todos  ⌄" /><Field label="Turma" placeholder="Todas as turmas  ⌄" /><Field label="Mensagem *" placeholder="Escreva o comunicado" multiline numberOfLines={7} /><Field label="Data de publicação" placeholder="Publicar agora  ⌄" /><Primary label="Publicar comunicado" onPress={() => go('notices')} /></Form>;
}

// Formulário de publicação de material.
function MaterialForm({ go, back }: Props) {
  const [selected, setSelected] = useState(false);
  return <Form title="Publicar material" step="Gestão" back={back}><Field label="Título *" placeholder="Nome do material" /><Field label="Descrição" placeholder="Descreva o conteúdo" multiline numberOfLines={4} /><Field label="Público *" placeholder="Todos ou uma turma  ⌄" /><Outline label={selected ? '✓ arquivo-teste.pdf selecionado' : 'Selecionar arquivo (PDF, imagem ou vídeo)'} onPress={() => setSelected(true)} /><Text style={s.hint}>Na integração, substitua esta seleção demonstrativa por um seletor de documentos e envie o arquivo para o endpoint de upload.</Text><Primary label="Publicar material" onPress={() => go('materials')} /></Form>;
}

// Tela de configurações.
function Settings({ go, back }: Props) {
  return <TeacherLayout go={go} current="settings"><Back onPress={back} /><Title>Configurações</Title><Field label="Nome do projeto" value="Projeto Impacto Social" /><Field label="Telefone de contato" value="(51) 99999-0000" keyboardType="phone-pad" /><Field label="E-mail" value="contato@projeto.org" keyboardType="email-address" /><Field label="Endereço das aulas" value="Ginásio da comunidade" /><Field label="Nome do professor" value="Professor responsável" /><Primary label="Salvar configurações" /><Outline label="Sair da conta" onPress={() => go('login')} /></TeacherLayout>;
}

// Tela da lista de presença.
function RollCall({ go, back }: Props) {
  const [present, setPresent] = useState<Record<string, boolean>>({ CAMILA: true, AYALA: true, EDUARDO: true, GABRIEL: true, ROGÉRIO: false });
  return <TeacherLayout go={go} current="rollCall"><Back onPress={back} /><Title>Lista de presença</Title><Subtitle><Text style={s.bold}>Aula:</Text> Terça-feira - 20/08/2026{`\n`}18:00 às 19:30</Subtitle><Input placeholder="⌕  Buscar aluno..." />{Object.entries(present).map(([name, checked]) => <Pressable key={name} style={s.studentRow} onPress={() => setPresent((value) => ({ ...value, [name]: !checked }))}><Avatar small /><CardTitle flex>{name}</CardTitle><Text style={[s.checkbox, checked && s.checked]}>{checked ? '✓' : ''}</Text></Pressable>)}<Primary label="Salvar presença" /></TeacherLayout>;
}

// Tela do ranking de presenças.
function Ranking({ go, back }: Props) {
  const data = [['CAMILA', '95%'], ['AYALA', '92%'], ['EDUARDO', '88%'], ['GABRIEL', '85%'], ['ROGÉRIO', '80%']];
  return <TeacherLayout go={go} current="ranking"><Back onPress={back} /><Title>Ranking de presenças</Title><Field label="Turma" value="Todos os alunos  ⌄" editable={false} /><Field label="Período" value="Último mês  ⌄" editable={false} />{data.map(([name, value], index) => <View style={s.rank} key={name}><Text style={[s.rankNumber, index === 0 && s.gold]}>{index + 1}º</Text><View><CardTitle>{name}</CardTitle><Text style={s.muted}>{value} de frequência</Text></View></View>)}</TeacherLayout>;
}

type Props = { go: Go; back: () => void };
// Área de conteúdo com rolagem.
function Page({ children }: { children: React.ReactNode }) { return <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">{children}</ScrollView>; }
// Estrutura visual usada nos formulários.
function Form({ title, step, back, children }: { title: string; step: string; back: () => void; children: React.ReactNode }) { return <Page><View style={s.formHead}><Back onPress={back} /><Text style={s.step}>{step}</Text></View><Title>{title}</Title>{children}</Page>; }
// Estrutura das telas do aluno e do responsável.
function StudentLayout({ children, go, current }: LayoutProps) { return <View style={s.flex}><Page>{children}</Page><Nav items={[['⌂', 'Início', 'studentHome'], ['▣', 'Aulas', 'classes'], ['●', 'Notificações', 'notices'], ['●', 'Perfil', 'studentHome']]} go={go} current={current} /></View>; }
// Estrutura das telas do professor.
function TeacherLayout({ children, go, current }: LayoutProps) { return <View style={s.flex}><Page>{children}</Page><Nav items={[['⌂', 'Início', 'teacherHome'], ['●●', 'Alunos', 'teacherHome'], ['▣', 'Aulas', 'rollCall'], ['•••', 'Mais', 'ranking']]} go={go} current={current} /></View>; }
type LayoutProps = { children: React.ReactNode; go: Go; current: Screen };
function Nav({ items, go, current }: { items: string[][]; go: Go; current: Screen }) { return <View style={s.nav}>{items.map(([icon, label, target]) => <Pressable style={s.navItem} key={label} onPress={() => go(target as Screen)}><Text style={[s.navIcon, target === current && s.blue]}>{icon}</Text><Text style={[s.navLabel, target === current && s.blue]}>{label}</Text></Pressable>)}</View>; }
function Title({ children, center = false }: { children: React.ReactNode; center?: boolean }) { return <Text style={[s.title, center && s.center]}>{children}</Text>; }
function Subtitle({ children }: { children: React.ReactNode }) { return <Text style={s.subtitle}>{children}</Text>; }
function CardTitle({ children, flex = false }: { children: React.ReactNode; flex?: boolean }) { return <Text style={[s.cardTitle, flex && s.flex]}>{children}</Text>; }
function Icon({ children }: { children: React.ReactNode }) { return <Text style={s.icon}>{children}</Text>; }
function Back({ onPress }: { onPress: () => void }) { return <Pressable style={s.back} onPress={onPress}><Text style={s.backText}>‹</Text></Pressable>; }
function Input(props: React.ComponentProps<typeof TextInput>) { return <TextInput style={s.input} placeholderTextColor="#7a849a" {...props} />; }
// Campo de formulário com título.
function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) { return <View style={s.field}><Text style={s.label}>{label}</Text><Input {...props} /></View>; }
function Primary({ label, onPress }: { label: string; onPress?: () => void }) { return <Pressable style={s.primary} onPress={onPress}><Text style={s.primaryText}>{label}</Text></Pressable>; }
function Outline({ label, onPress }: { label: string; onPress?: () => void }) { return <Pressable style={s.outline} onPress={onPress}><Text style={s.outlineText}>{label}</Text></Pressable>; }
function Link({ label, onPress }: { label: string; onPress?: () => void }) { return <Pressable onPress={onPress}><Text style={s.link}>{label}</Text></Pressable>; }
function Choice({ selected, icon, title, text, onPress }: { selected: boolean; icon: string; title: string; text: string; onPress: () => void }) { return <Pressable style={[s.choice, selected && s.selected]} onPress={onPress}><Icon>{icon}</Icon><View style={s.flex}><CardTitle>{title}</CardTitle><Text style={s.muted}>{text}</Text></View></Pressable>; }
// Cartão de opção das telas iniciais.
function Menu({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) { return <Pressable style={s.menu} onPress={onPress}><Icon>{icon}</Icon><Text style={s.menuLabel}>{label}</Text></Pressable>; }
function Avatar({ small = false }: { small?: boolean }) { return <View style={[s.avatar, small && s.avatarSmall]}><Text style={[s.avatarDot, small && s.avatarDotSmall]}>●</Text></View>; }
function Stat({ label, value, green = false }: { label: string; value: string; green?: boolean }) { return <View style={s.stat}><Text style={s.statLabel}>{label}</Text><Text style={[s.statValue, green && s.green]}>{value}</Text></View>; }
function Feedback({ children }: { children: React.ReactNode }) { return <View style={s.feedback}><Text style={s.feedbackText}>{children}</Text></View>; }
function Info({ label, value }: { label: string; value: string }) { return <View style={s.info}><Text style={s.infoLabel}>{label}</Text><Text style={s.infoValue}>{value}</Text></View>; }
function EntityRow({ title, detail, onPress }: { title: string; detail: string; onPress?: () => void }) { return <Pressable style={s.entity} onPress={onPress}><Avatar small /><View style={s.flex}><CardTitle>{title}</CardTitle><Text style={s.muted}>{detail}</Text></View><Text style={s.chevron}>›</Text></Pressable>; }
// Menu flutuante com acesso a todas as telas.
function DemoMenu({ current, go }: { current: Screen; go: Go }) { const [open, setOpen] = useState(false); return <View style={s.demo}>{open && <ScrollView style={s.demoList}>{(Object.keys(labels) as Screen[]).map((item) => <Pressable style={s.demoItem} key={item} onPress={() => { go(item); setOpen(false); }}><Text style={[s.demoText, current === item && s.blue]}>{labels[item]}</Text></Pressable>)}</ScrollView>}<Pressable style={s.demoButton} onPress={() => setOpen((value) => !value)}><Text style={s.demoButtonText}>{open ? '×' : '☰'}</Text></Pressable></View>; }

// Estilos visuais do aplicativo.
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' }, app: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center' }, flex: { flex: 1 }, page: { padding: 28, paddingBottom: 42, gap: 16 }, title: { color: NAVY, fontSize: 34, lineHeight: 42, fontWeight: '800', marginVertical: 8 }, center: { textAlign: 'center' }, subtitle: { color: NAVY, fontSize: 20, lineHeight: 28, marginBottom: 12 }, centerText: { color: NAVY, fontSize: 18, lineHeight: 27, textAlign: 'center' }, logo: { alignItems: 'center', marginTop: 12 }, logoIcon: { fontSize: 72 }, logoText: { color: BLUE, fontSize: 27, fontWeight: '900', fontStyle: 'italic' }, logoSub: { color: NAVY, fontWeight: '700', letterSpacing: 1 }, input: { minHeight: 58, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12, color: NAVY, backgroundColor: '#fff', fontSize: 17, textAlignVertical: 'top' }, field: { gap: 8, marginBottom: 2 }, label: { color: NAVY, fontWeight: '700', fontSize: 17 }, primary: { minHeight: 58, borderRadius: 12, backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center', marginTop: 8, padding: 12 }, primaryText: { color: '#fff', fontSize: 19, fontWeight: '800', textAlign: 'center' }, outline: { minHeight: 58, borderRadius: 12, borderWidth: 2, borderColor: BLUE, justifyContent: 'center', alignItems: 'center', padding: 12 }, outlineText: { color: BLUE, fontSize: 18, fontWeight: '800', textAlign: 'center' }, link: { color: BLUE, textAlign: 'center', paddingVertical: 5, fontSize: 16, fontWeight: '700' }, formHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, step: { color: BLUE, fontWeight: '700' }, back: { width: 44, height: 44, justifyContent: 'center' }, backText: { color: NAVY, fontSize: 44, lineHeight: 44 }, choice: { flexDirection: 'row', alignItems: 'center', gap: 20, minHeight: 160, padding: 24, borderWidth: 1, borderColor: BORDER, borderRadius: 16 }, selected: { borderWidth: 2, borderColor: BLUE }, icon: { color: BLUE, fontSize: 40, fontWeight: '800' }, cardTitle: { color: NAVY, fontSize: 20, lineHeight: 28, fontWeight: '800' }, muted: { color: MUTED, fontSize: 17, lineHeight: 25, marginTop: 3 }, profile: { flexDirection: 'row', alignItems: 'center', gap: 18, padding: 20, borderWidth: 1, borderColor: BORDER, borderRadius: 16 }, avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#edf2ff', justifyContent: 'center', alignItems: 'center' }, avatarSmall: { width: 50, height: 50, borderRadius: 25 }, avatarDot: { color: BLUE, fontSize: 55 }, avatarDotSmall: { fontSize: 30 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 }, menu: { width: '47.5%', aspectRatio: 1.12, borderWidth: 1, borderColor: BORDER, borderRadius: 16, justifyContent: 'center', alignItems: 'center', padding: 10 }, menuLabel: { color: NAVY, fontSize: 19, fontWeight: '800', textAlign: 'center', marginTop: 10 }, motto: { padding: 24, borderWidth: 1, borderColor: BORDER, borderRadius: 16 }, mottoText: { color: BLUE, fontSize: 22, lineHeight: 30, fontWeight: '900', fontStyle: 'italic', textAlign: 'center' }, nav: { flexDirection: 'row', minHeight: 76, borderTopWidth: 1, borderTopColor: BORDER, backgroundColor: '#fff' }, navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navIcon: { color: MUTED, fontSize: 23, fontWeight: '800' }, navLabel: { color: MUTED, fontSize: 12, fontWeight: '700', marginTop: 3 }, blue: { color: BLUE }, tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: BORDER }, tab: { flex: 1, textAlign: 'center', padding: 13, color: NAVY, fontSize: 17 }, activeTab: { flex: 1, textAlign: 'center', padding: 13, color: BLUE, fontWeight: '800', fontSize: 17, borderBottomWidth: 4, borderBottomColor: BLUE }, listCard: { flexDirection: 'row', alignItems: 'center', gap: 24, minHeight: 145, padding: 22, borderWidth: 1, borderColor: BORDER, borderRadius: 16 }, section: { color: NAVY, fontSize: 22, fontWeight: '800', marginTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: BORDER }, stat: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 17, borderBottomWidth: 1, borderBottomColor: BORDER }, statLabel: { color: NAVY, fontSize: 18 }, statValue: { color: NAVY, fontSize: 26, fontWeight: '800' }, green: { color: '#0b9d39' }, notice: { borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 20, gap: 12 }, noticeHead: { flexDirection: 'row', alignItems: 'center', gap: 10 }, dot: { width: 20, height: 20, borderRadius: 4 }, badge: { color: '#fff', marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18, fontWeight: '700' }, body: { color: NAVY, fontSize: 17, lineHeight: 26 }, file: { flexDirection: 'row', alignItems: 'center', gap: 18, minHeight: 116, padding: 20, borderWidth: 1, borderColor: BORDER, borderRadius: 16 }, bold: { fontWeight: '800' }, hint: { color: MUTED, fontSize: 14, lineHeight: 21 }, feedback: { padding: 14, borderRadius: 10, backgroundColor: '#eaf8ee', borderWidth: 1, borderColor: '#9bd8aa' }, feedbackText: { color: '#08752b', fontSize: 16, fontWeight: '600' }, info: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: BORDER }, infoLabel: { color: MUTED, fontSize: 14, fontWeight: '700' }, infoValue: { color: NAVY, fontSize: 18, marginTop: 4 }, entity: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 86, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BORDER }, chevron: { color: BLUE, fontSize: 34 }, studentRow: { flexDirection: 'row', alignItems: 'center', gap: 18, minHeight: 76, borderBottomWidth: 1, borderBottomColor: BORDER }, checkbox: { width: 42, height: 42, lineHeight: 36, borderWidth: 3, borderColor: '#aab2c1', borderRadius: 8, color: '#fff', fontSize: 27, fontWeight: '800', textAlign: 'center' }, checked: { backgroundColor: '#0b9d39', borderColor: '#0b9d39' }, rank: { flexDirection: 'row', alignItems: 'center', gap: 22, minHeight: 94, borderBottomWidth: 1, borderBottomColor: BORDER }, rankNumber: { minWidth: 62, color: MUTED, fontSize: 38, fontWeight: '800' }, gold: { color: '#f2ad00' }, demo: { position: 'absolute', right: 14, bottom: 88, alignItems: 'flex-end' }, demoButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6 }, demoButtonText: { color: '#fff', fontSize: 23, fontWeight: '800' }, demoList: { width: 235, maxHeight: 410, backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 6, marginBottom: 8, elevation: 5 }, demoItem: { paddingVertical: 10, paddingHorizontal: 12 }, demoText: { color: NAVY, fontWeight: '600' },
});
