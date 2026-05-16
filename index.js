const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const M3U_URL = 'http://abre.ai/manotv3';

const CATEGORIES = [
  {
    id: 'cat_globo',
    name: 'Canais Globo',
    keywords: [
      'globo', 'ge tv', 'tv tem', 'rpc', 'rbs', 'nsc', 'tv clube', 'verde mares',
      'tv subaé', 'subaé', 'rede amazonica', 'amazonica', 'tv liberal', 'liberal',
      'canais | globo', 'globo sp', 'globo rj', 'globo mg', 'globo rs', 'globo pr',
      'globo sc', 'globo ba', 'globo pe', 'globo ce', 'globo go', 'globo df',
      'globo ms', 'globo mt', 'globo ro', 'globo ac', 'globo al', 'globo am',
      'globo ap', 'globo es', 'globo ma', 'globo pb', 'globo pi', 'globo rn',
      'globo rr', 'globo se', 'globo to', 'globo hd', 'globo fhd', 'globo 4k',
      'rede globo', 'tv globo', 'globonews', 'gnt', 'globo 2', 'globo 3',
      'tv globo 2', 'globoplay', 'globo inter tv', 'inter tv',
      'Globo', 'GLOBO', 'GloboNews', 'GLOBONEWS', 'TV Globo', 'Rede Globo',
      'REDE GLOBO', 'GNT', 'Gnt', 'Futura', 'FUTURA', 'TV Futura', 'TV FUTURA',
      'tv futura', 'futura hd', 'Futura HD', 'FUTURA HD',
      'Viva', 'VIVA', 'Canal Viva', 'CANAL VIVA', 'canal viva', 'viva hd',
      'Multishow', 'MULTISHOW', 'multishow', 'multishow hd',
      'Bis', 'BIS', 'bis hd', 'BIS HD',
      'Woohoo', 'WOOHOO', 'woohoo', 'woohoo hd',
      'Globo RJ HD', 'Globo SP HD', 'Globo MG HD', 'Globo RS HD',
      'Globo PR HD', 'Globo SC HD', 'Globo BA HD', 'Globo PE HD',
      'Globo CE HD', 'Globo GO HD', 'Globo DF HD',
      'GLOBO RJ HD', 'GLOBO SP HD', 'GLOBO MG HD', 'GLOBO RS HD',
      'globo rj hd', 'globo sp hd', 'globo mg hd', 'globo rs hd',
      'globo pr hd', 'globo sc hd', 'globo ba hd', 'globo pe hd',
      'globo ce hd', 'globo go hd', 'globo df hd',
      'Globo RJ FHD', 'Globo SP FHD', 'globo rj fhd', 'globo sp fhd',
      'Globo 1', 'Globo 4', 'Globo 5', 'GLOBO 1', 'GLOBO 2', 'GLOBO 3',
      'GLOBO 4', 'GLOBO 5', 'globo 1', 'globo 4', 'globo 5',
      'Globo RJ²', 'Globo SP²', 'Globo HD²', 'Globo RJ³', 'Globo SP³',
      'globo rj²', 'globo sp²', 'globo hd²', 'globo rj³', 'globo sp³',
      'TV GLOBO SÃO PAULO', 'tv globo são paulo', 'TV GLOBO RIO DE JANEIRO',
      'GLOBO SÃO PAULO', 'globo são paulo', 'GLOBO RIO DE JANEIRO',
      'globo rio de janeiro', 'GLOBO MINAS GERAIS', 'globo minas gerais',
      'GLOBO RIO GRANDE DO SUL', 'globo rio grande do sul',
      'GLOBO PARANÁ', 'globo paraná', 'GLOBO SANTA CATARINA', 'globo santa catarina',
      'GLOBO BAHIA', 'globo bahia', 'GLOBO PERNAMBUCO', 'globo pernambuco',
      'GLOBO CEARÁ', 'globo ceará', 'GLOBO GOIÁS', 'globo goiás',
      'GLOBO BRASÍLIA', 'globo brasília', 'GLOBO ESPÍRITO SANTO', 'globo espírito santo',
      'GLOBO ACRE', 'GLOBO ALAGOAS', 'GLOBO AMAPÁ', 'GLOBO AMAZONAS',
      'GLOBO MARANHÃO', 'GLOBO PARAÍBA', 'GLOBO PIAUÍ', 'GLOBO RONDÔNIA',
      'GLOBO RORAIMA', 'GLOBO SERGIPE', 'GLOBO TOCANTINS',
      'Inter TV', 'INTER TV', 'inter tv', 'inter tv hd', 'Inter TV HD',
      'TV Tem', 'TV TEM', 'tv tem', 'TV TEM HD', 'tv tem hd',
      'RPC', 'rpc tv', 'RPC TV', 'rpc hd', 'RPC HD',
      'NSC TV', 'nsc tv', 'NSC', 'nsc hd', 'NSC HD',
      'TVE Bahia', 'TVE BAHIA', 'tve bahia', 'TVE Bahia HD', 'TVE BAHIA HD',
      'Rede Amazônica', 'REDE AMAZÔNICA', 'rede amazônica',
      'TV Liberal', 'TV LIBERAL', 'tv liberal hd',
      'RBS TV', 'rbs tv', 'RBS', 'rbs hd', 'RBS HD',
      'TV Clube', 'TV CLUBE', 'tv clube hd',
      'Verde Mar', 'VERDE MAR', 'verde mar', 'verde mar hd',
      'globoplay', 'GloboPlay', 'GLOBOPLAY'
    ]
  },
  {
    id: 'cat_record',
    name: 'Canais Record',
    keywords: [
      'record', 'recordtv', 'canais | record tv', 'tv tropical', 'record sictv',
      'record sp', 'record rj', 'record mg', 'record rs', 'record pr', 'record sc',
      'record ba', 'record pe', 'record ce', 'record go', 'record df', 'record ms',
      'record mt', 'record ro', 'record ac', 'record al', 'record am', 'record ap',
      'record es', 'record ma', 'record pb', 'record pi', 'record rn', 'record rr',
      'record se', 'record to', 'record hd', 'record fhd', 'record 4k',
      'rede record', 'tv record', 'recordnews', 'record news', 'record europa',
      'record internacional',
      'Record', 'RECORD', 'RecordTV', 'RECORDTV', 'Record SP', 'Record RJ',
      'Record MG', 'Record RS', 'Record PR', 'Record SC', 'Record BA', 'Record PE',
      'Record CE', 'Record GO', 'Record DF', 'Record HD', 'Record FHD',
      'TV Record', 'Rede Record', 'REDE RECORD', 'RecordNews', 'RECORDNEWS',
      'Record News', 'RECORD NEWS',
      'RECORD SÃO PAULO', 'record são paulo', 'RECORD RIO DE JANEIRO',
      'record rio de janeiro', 'RECORD MINAS GERAIS', 'record minas gerais',
      'RECORD RIO GRANDE DO SUL', 'record rio grande do sul',
      'RECORD PARANÁ', 'record paraná', 'RECORD SANTA CATARINA', 'record santa catarina',
      'RECORD BAHIA', 'record bahia', 'RECORD PERNAMBUCO', 'record pernambuco',
      'RECORD CEARÁ', 'record ceará', 'RECORD GOIÁS', 'record goiás',
      'RECORD BRASÍLIA', 'record brasília', 'RECORD MATO GROSSO', 'record mato grosso',
      'RECORD ESPÍRITO SANTO', 'record espírito santo',
      'Record SP HD', 'Record RJ HD', 'Record MG HD', 'Record RS HD',
      'Record PR HD', 'Record SC HD', 'Record BA HD', 'Record PE HD',
      'Record CE HD', 'Record GO HD', 'Record DF HD',
      'Record SP FHD', 'Record RJ FHD', 'Record MG FHD', 'Record RS FHD',
      'Record SP 4K', 'Record RJ 4K', 'Record MG 4K',
      'record sp hd', 'record rj hd', 'record mg hd', 'record rs hd',
      'record pr hd', 'record sc hd', 'record ba hd', 'record pe hd',
      'record ce hd', 'record go hd', 'record df hd',
      'record sp fhd', 'record rj fhd', 'record mg fhd', 'record rs fhd',
      'RECORD SP HD', 'RECORD RJ HD', 'RECORD MG HD', 'RECORD RS HD',
      'RECORD SP FHD', 'RECORD RJ FHD', 'RECORD MG FHD', 'RECORD RS FHD',
      'Record SP²', 'Record RJ²', 'Record HD²', 'Record SP³', 'Record RJ³',
      'record sp²', 'record rj²', 'record hd²', 'record sp³', 'record rj³',
      'RECORD 1', 'RECORD 2', 'RECORD 3', 'RECORD 4', 'RECORD 5',
      'record 1', 'record 4', 'record 5', 'Record 1', 'Record 4', 'Record 5',
      'TV Tropical', 'TV TROPICAL', 'tv tropical hd',
      'SIC TV', 'SICTV', 'sictv', 'sic tv', 'Record SicTV', 'RECORD SICTV',
      'TV Record Europa', 'TV RECORD EUROPA', 'record europa hd',
      'Record Internacional', 'RECORD INTERNACIONAL'
    ]
  },
  {
    id: 'cat_sbt',
    name: 'Canais SBT',
    keywords: [
      'sbt', 'canais | sbt', 'tv difusora', 'tv aratu', 'sbt guajará',
      'sbt cidade verde', 'sistema brasileiro', 'sbt interior', 'sbt mais',
      'sbt sp', 'sbt rj', 'sbt mg', 'sbt rs', 'sbt pr', 'sbt sc', 'sbt ba',
      'sbt pe', 'sbt ce', 'sbt go', 'sbt df', 'sbt ms', 'sbt mt', 'sbt ro',
      'sbt ac', 'sbt al', 'sbt am', 'sbt ap', 'sbt es', 'sbt ma', 'sbt pb',
      'sbt pi', 'sbt rn', 'sbt rr', 'sbt se', 'sbt to', 'sbt hd', 'sbt fhd', 'sbt 4k',
      'SBT', 'Sbt', 'SBT SP', 'SBT RJ', 'SBT MG', 'SBT RS', 'SBT PR', 'SBT SC',
      'SBT BA', 'SBT PE', 'SBT CE', 'SBT GO', 'SBT DF', 'SBT HD', 'SBT FHD',
      'TV SBT', 'Sistema Brasileiro', 'SISTEMA BRASILEIRO',
      'TV ARATU', 'TV Aratu', 'tv aratu',
      'SBT SÃO PAULO', 'sbt são paulo', 'SBT RIO DE JANEIRO', 'sbt rio de janeiro',
      'SBT MINAS GERAIS', 'sbt minas gerais', 'SBT RIO GRANDE DO SUL',
      'SBT PARANÁ', 'sbt paraná', 'SBT SANTA CATARINA', 'sbt santa catarina',
      'SBT BAHIA', 'sbt bahia', 'SBT PERNAMBUCO', 'sbt pernambuco',
      'SBT CEARÁ', 'sbt ceará', 'SBT GOIÁS', 'sbt goiás',
      'SBT BRASÍLIA', 'sbt brasília', 'SBT MATO GROSSO', 'sbt mato grosso',
      'SBT ESPÍRITO SANTO', 'sbt espírito santo',
      'SBT SP HD', 'SBT RJ HD', 'SBT MG HD', 'SBT RS HD',
      'SBT PR HD', 'SBT SC HD', 'SBT BA HD', 'SBT PE HD',
      'SBT CE HD', 'SBT GO HD', 'SBT DF HD',
      'SBT SP FHD', 'SBT RJ FHD', 'SBT MG FHD', 'SBT RS FHD',
      'sbt sp hd', 'sbt rj hd', 'sbt mg hd', 'sbt rs hd',
      'sbt pr hd', 'sbt sc hd', 'sbt ba hd', 'sbt pe hd',
      'sbt ce hd', 'sbt go hd', 'sbt df hd',
      'sbt sp fhd', 'sbt rj fhd', 'sbt mg fhd', 'sbt rs fhd',
      'TV ARATU HD', 'TV Aratu HD', 'tv aratu hd', 'TV ARATU FHD',
      'SBT SP²', 'SBT RJ²', 'SBT HD²', 'SBT SP³', 'SBT RJ³',
      'sbt sp²', 'sbt rj²', 'sbt hd²', 'sbt sp³', 'sbt rj³',
      'SBT 1', 'SBT 2', 'SBT 3', 'SBT 4', 'SBT 5',
      'sbt 1', 'sbt 4', 'sbt 5', 'Sbt 1', 'Sbt 4', 'Sbt 5',
      'SISTEMA BRASILEIRO DE TELEVISÃO', 'sistema brasileiro de televisão',
      'Sistema Brasileiro de Televisão',
      'TV Difusora', 'TV DIFUSORA', 'tv difusora hd',
      'SBT Guajará', 'SBT GUAJARÁ', 'sbt guajará hd',
      'SBT Cidade Verde', 'SBT CIDADE VERDE', 'sbt cidade verde hd'
    ]
  },
  {
    id: 'cat_band',
    name: 'Canais Band',
    keywords: [
      'band', 'canais | band tv', 'band arapuan', 'band rba tv', 'band mato grosso',
      'new brasil', 'rede bandeirantes', 'tv band', 'bandeirantes', 'bandnews tv',
      'band sp', 'band rj', 'band mg', 'band rs', 'band pr', 'band sc', 'band ba',
      'band pe', 'band ce', 'band go', 'band df', 'band ms', 'band mt', 'band ro',
      'band ac', 'band al', 'band am', 'band ap', 'band es', 'band ma', 'band pb',
      'band pi', 'band rn', 'band rr', 'band se', 'band to', 'band hd', 'band fhd', 'band 4k',
      'Band', 'BAND', 'Band SP', 'Band RJ', 'Band MG', 'Band RS', 'Band PR', 'Band SC',
      'Band BA', 'Band PE', 'Band CE', 'Band GO', 'Band DF', 'Band HD', 'Band FHD',
      'TV Band', 'Bandeirantes', 'BANDEIRANTES', 'Rede Bandeirantes', 'REDE BANDEIRANTES',
      'BandNews', 'BANDNEWS', 'Band News', 'BAND NEWS',
      'BAND SÃO PAULO', 'band são paulo', 'BAND RIO DE JANEIRO', 'band rio de janeiro',
      'BAND MINAS GERAIS', 'band minas gerais', 'BAND RIO GRANDE DO SUL',
      'BAND PARANÁ', 'band paraná', 'BAND SANTA CATARINA', 'band santa catarina',
      'BAND BAHIA', 'band bahia', 'BAND PERNAMBUCO', 'band pernambuco',
      'BAND CEARÁ', 'band ceará', 'BAND GOIÁS', 'band goiás',
      'BAND BRASÍLIA', 'band brasília', 'BAND MATO GROSSO', 'band mato grosso',
      'BAND ESPÍRITO SANTO', 'band espírito santo',
      'Band SP HD', 'Band RJ HD', 'Band MG HD', 'Band RS HD',
      'Band PR HD', 'Band SC HD', 'Band BA HD', 'Band PE HD',
      'Band CE HD', 'Band GO HD', 'Band DF HD',
      'Band SP FHD', 'Band RJ FHD', 'Band MG FHD', 'Band RS FHD',
      'Band SP 4K', 'Band RJ 4K', 'Band MG 4K',
      'band sp hd', 'band rj hd', 'band mg hd', 'band rs hd',
      'band pr hd', 'band sc hd', 'band ba hd', 'band pe hd',
      'band ce hd', 'band go hd', 'band df hd',
      'band sp fhd', 'band rj fhd', 'band mg fhd', 'band rs fhd',
      'BAND SP HD', 'BAND RJ HD', 'BAND MG HD', 'BAND RS HD',
      'BAND SP FHD', 'BAND RJ FHD', 'BAND MG FHD', 'BAND RS FHD',
      'Band SP²', 'Band RJ²', 'Band HD²', 'Band SP³', 'Band RJ³',
      'band sp²', 'band rj²', 'band hd²', 'band sp³', 'band rj³',
      'BAND 1', 'BAND 2', 'BAND 3', 'BAND 4', 'BAND 5',
      'band 1', 'band 4', 'band 5', 'Band 1', 'Band 4', 'Band 5',
      'BandSports', 'BANDSPORTS', 'bandsports', 'Band Sports', 'BAND SPORTS', 'band sports',
      'BandSports HD', 'BANDSPORTS HD', 'bandsports hd', 'Band Sports HD', 'BAND SPORTS HD',
      'Band Arapuan', 'BAND ARAPUAN', 'band arapuan hd',
      'TV Band RBA', 'TV BAND RBA', 'band rba tv hd',
      'New Brasil', 'NEW BRASIL', 'new brasil hd',
      'Band FM', 'BAND FM', 'band fm hd',
      'Band Play', 'BAND PLAY', 'band play hd'
    ]
  },
  {
    id: 'cat_redetv',
    name: 'RedeTV! & CNT',
    keywords: [
      'redetv', 'rede tv', 'rede tv!', 'redtv', 'redetv!', 'canais | redetv',
      'RedeTV', 'REDETV', 'RedeTV!', 'REDETV!', 'Rede TV', 'REDE TV',
      'RedeTV HD', 'REDETV HD', 'redetv hd', 'rede tv hd',
      'RedeTV FHD', 'REDETV FHD', 'redetv fhd',
      'RedeTV SP', 'RedeTV RJ', 'redetv sp', 'redetv rj',
      'RedeTV SP HD', 'RedeTV RJ HD', 'redetv sp hd', 'redetv rj hd',
      'RedeTV²', 'RedeTV³', 'redetv²', 'redetv³',
      'REDETV 1', 'REDETV 2', 'REDETV 3', 'redetv 1', 'redetv 4', 'redetv 5',
      'cnt', 'rede cnt', 'CNT', 'Rede CNT', 'REDE CNT', 'cnt hd', 'CNT HD',
      'CNT Sport', 'CNT SPORT', 'cnt sport', 'CNT Sport HD', 'cnt sport hd',
      'TV Gazeta', 'TV GAZETA', 'tv gazeta', 'tv gazeta hd', 'TV GAZETA HD',
      'TV Gazeta SP', 'TV GAZETA SP', 'tv gazeta sp',
      'Gazeta', 'GAZETA', 'gazeta hd',
      'CNT HD', 'CNT FHD', 'cnt fhd', 'CNT 4K', 'cnt 4k',
      'CNT²', 'CNT³', 'cnt²', 'cnt³',
      'Rede CNT HD', 'REDE CNT HD', 'rede cnt hd',
      'TV Cultura', 'TV CULTURA', 'tv cultura', 'tv cultura hd', 'TV CULTURA HD',
      'Cultura', 'CULTURA', 'cultura hd',
      'TV Cultura SP', 'TV CULTURA SP', 'tv cultura sp',
      'Cultura SP', 'CULTURA SP', 'cultura sp hd'
    ]
  },
  {
    id: 'cat_sportv',
    name: 'SporTV',
    keywords: [
      'sportv', 'canais | sportv', 'sportv hd', 'sportv fhd', 'sportv 4k',
      'sportv 2', 'sportv 3', 'sportv 4', 'sportv 5', 'sportv+', 'sportv mais',
      'spor tv', 'sportv1', 'sportv2', 'sportv3', 'sportv4', 'sportv5',
      'SporTV', 'SPORTV', 'SporTV HD', 'SporTV FHD', 'SporTV 2', 'SporTV 3',
      'SporTV 4', 'SporTV 5', 'SporTV+', 'SporTV Plus', 'SPORTV+', 'SPORTV PLUS',
      'Spor TV', 'SPOR TV', 'Sport TV', 'SPORT TV',
      'SporTV 2 HD', 'SporTV 3 HD', 'SporTV 4 HD', 'SporTV 5 HD',
      'SporTV 2 FHD', 'SporTV 3 FHD', 'SporTV 4 FHD', 'SporTV 5 FHD',
      'SporTV 2 4K', 'SporTV 3 4K', 'SporTV 4 4K', 'SporTV 5 4K',
      'sportv 2 hd', 'sportv 3 hd', 'sportv 4 hd', 'sportv 5 hd',
      'sportv 2 fhd', 'sportv 3 fhd', 'sportv 4 fhd', 'sportv 5 fhd',
      'SPORTV 2 HD', 'SPORTV 3 HD', 'SPORTV 4 HD', 'SPORTV 5 HD',
      'Sport TV 2 HD', 'Sport TV 3 HD', 'Sport TV 4 HD', 'Sport TV 5 HD',
      'SporTV²', 'SporTV³', 'SporTV⁴', 'SporTV⁵',
      'SporTV HD²', 'SporTV HD³', 'SporTV HD⁴', 'SporTV HD⁵',
      'sportv²', 'sportv³', 'sportv⁴', 'sportv⁵',
      'Sport TV²', 'Sport TV³', 'Sport TV⁴', 'Sport TV⁵'
    ]
  },
  {
    id: 'cat_espn',
    name: 'ESPN & Fox Sports',
    keywords: [
      'espn', 'canais | espn', 'espn hd', 'espn fhd', 'espn 4k', 'espn brasil',
      'espn 2', 'espn 3', 'espn 4', 'espn extra', 'fox sports', 'fox sports hd',
      'fox sports 2', 'fox sports 3', 'espn1', 'espn2', 'espn3', 'espn4',
      'espn deportes', 'espn news', 'espn classic', 'espn+ plus', 'espn plus',
      'ESPN', 'Espn', 'ESPN HD', 'ESPN FHD', 'ESPN 2', 'ESPN 3', 'ESPN 4',
      'ESPN Brasil', 'ESPN BRASIL', 'ESPN Extra', 'ESPN EXTRA',
      'Fox Sports', 'FOX SPORTS', 'Fox Sports HD', 'FOX SPORTS HD',
      'ESPN News', 'ESPN NEWS', 'ESPN Classic', 'ESPN CLASSIC',
      'ESPN+', 'ESPN Plus', 'ESPN PLUS',
      'ESPN 2 HD', 'ESPN 3 HD', 'ESPN 4 HD',
      'ESPN 2 FHD', 'ESPN 3 FHD', 'ESPN 4 FHD',
      'ESPN Brasil HD', 'ESPN Brasil FHD', 'ESPN Brasil 4K',
      'ESPN BRASIL HD', 'ESPN BRASIL FHD', 'ESPN BRASIL 4K',
      'espn 2 hd', 'espn 3 hd', 'espn 4 hd',
      'espn brasil hd', 'espn brasil fhd', 'espn brasil 4k',
      'Fox Sports 2 HD', 'Fox Sports 3 HD', 'Fox Sports 2 FHD',
      'fox sports 2 hd', 'fox sports 3 hd', 'fox sports 2 fhd',
      'FOX SPORTS 2 HD', 'FOX SPORTS 3 HD', 'FOX SPORTS 2 FHD',
      'ESPN²', 'ESPN³', 'ESPN⁴', 'ESPN⁵',
      'espn²', 'espn³', 'espn⁴', 'espn⁵',
      'Fox Sports²', 'Fox Sports³', 'Fox Sports⁴', 'Fox Sports⁵',
      'Fox Sports HD²', 'Fox Sports HD³', 'Fox Sports HD⁴'
    ]
  },
  {
    id: 'cat_esportes',
    name: 'Esportes',
    keywords: [
      'esportes', 'premiere', 'futebol', 'libertadores', 'cazé', 'desempedido',
      'nsports', 'canais | esportes', 'canais | lutas', 'canais | premiere',
      'ao vivo | brasileirão', 'ao vivo | copa do brasil', 'ao vivo | futebol',
      'ao vivo | esportes', 'band sports', 'combate', 'ufc fightpass', 'dazn f1',
      'auto tv', 'ge tv', 'xsports', 'fifa plus', 'realmadrid tv', 'barça one',
      'fuel tv', 'woohoo', 'canal do inter', 'pontv', 'trace sport stars',
      'esportes brasília', 'premiere hd', 'premiere fhd', 'premiere 4k',
      'premiere 2', 'premiere 3', 'premiere 4', 'premiere 5', 'premiere 6',
      'premiere 7', 'premiere 8', 'premiere 9', 'premiere 10',
      'premiere clubes', 'premiere fc', 'band sports hd', 'combate hd',
      'esporte interativo', 'ei plus', 'ei maxx', 'ei maxx 2', 'ei maxx 3',
      'tnt sports', 'tnt sports hd', 'bandsports 2', 'bandsports 3',
      'PREMIERE', 'Premiere', 'PREMIERE HD', 'PREMIERE FHD', 'PREMIERE 4K',
      'PREMIERE CLUBES', 'PREMIERE FC',
      'COMBATE', 'Combate', 'COMBATE HD', 'COMBATE FHD', 'COMBATE 4K',
      'BAND SPORTS', 'Band Sports', 'BANDSPORTS', 'BandSports',
      'BAND SPORTS HD', 'Band Sports HD', 'BANDSPORTS HD', 'BandSports HD',
      'UFC', 'ufc', 'UFC FIGHT PASS', 'ufc fight pass', 'UFC FightPass',
      'TNT SPORTS', 'tnt sports', 'TNT Sports', 'TNT SPORTS HD', 'TNT Sports HD',
      'PREMIERE²', 'PREMIERE³', 'PREMIERE⁴', 'PREMIERE⁵',
      'premiere²', 'premiere³', 'premiere⁴', 'premiere⁵',
      'COMBATE²', 'COMBATE³', 'COMBATE⁴', 'COMBATE⁵',
      'PREMIERE 1', 'COMBATE 1',
      'NSports', 'NSPORTS', 'nsports', 'NSports HD', 'NSPORTS HD',
      'Cazé TV', 'CAZÉ TV', 'caze tv', 'cazé tv hd', 'CAZÉ TV HD',
      'Desimpedidos', 'DESIMPEDIDOS', 'desimpedidos', 'desimpedidos hd',
      'Canal do Inter', 'CANAL DO INTER', 'canal do inter hd',
      'DAZN', 'dazn', 'Dazn', 'DAZN HD', 'dazn hd', 'DAZN F1', 'dazn f1',
      'F1 TV', 'f1 tv', 'F1TV', 'f1tv', 'F1 TV PRO', 'f1 tv pro',
      'Motorsport', 'MOTORSPORT', 'motorsport', 'motorsport hd',
      'Combate Sports', 'COMBATE SPORTS', 'combate sports',
      'XSports', 'XSPORTS', 'xsports hd', 'X Sports', 'X SPORTS',
      'BandSports', 'bandsports hd',
      'Esporte Interativo', 'ESPORTE INTERATIVO', 'esporte interativo',
      'EI Plus', 'EI PLUS', 'ei plus hd', 'EI Maxx', 'EI MAXX',
      'Copa Libertadores', 'COPA LIBERTADORES', 'libertadores hd',
      'Conmebol TV', 'CONMEBOL TV', 'conmebol tv', 'conmebol tv hd',
      'FIFA+', 'fifa plus', 'fifa+ hd',
      'Real Madrid TV', 'REAL MADRID TV', 'realmadrid tv hd',
      'Barça One', 'BARÇA ONE', 'barça one hd', 'Barca One', 'BARCA ONE',
      'Fuel TV', 'FUEL TV', 'fuel tv hd',
      'Pon TV', 'PON TV', 'pontv hd', 'Canal do Boi Esportes',
      'Trace Sport Stars', 'TRACE SPORT STARS', 'trace sport stars hd',
      'GE TV', 'ge tv', 'GE TV HD', 'ge tv hd',
      'Brasileirão', 'BRASILEIRÃO', 'brasileirao', 'BRASILEIRAO',
      'Copa do Brasil', 'COPA DO BRASIL', 'copa do brasil hd',
      'Campeonato Brasileiro', 'CAMPEONATO BRASILEIRO',
      'SFT', 'sft', 'SFT Combat', 'sft combat', 'SFT HD', 'sft hd',
      'PFL', 'pfl', 'PFL Combat', 'pfl combat',
      'Lucha Libre', 'LUCHA LIBRE', 'lucha libre hd',
      'WWE', 'wwe', 'WWE Network', 'wwe network',
      'Ring Of Honor', 'ROH', 'roh', 'ring of honor',
      'ONE Championship', 'ONE FC', 'one championship', 'one fc',
      'Bellator', 'BELLATOR', 'bellator hd'
    ]
  },
  {
    id: 'cat_filmes',
    name: 'Filmes e Séries',
    keywords: [
      'filmes', 'series', 'séries', 'telecine', 'space', 'tnt', 'runtime',
      'cine', 'movies', 'canais | filmes e series', 'canais | filmes',
      'canais | south park', 'amc', 'tela brasil tv', 'cine brasil',
      'mytime movies', 'movie sphere', 'sony one', 'bora filmes', 'cine monde',
      'dark flix', 'tv nova play', 'channel one', 'hto filmes',
      'telecine hd', 'telecine fhd', 'telecine action', 'telecine premium',
      'telecine pipoca', 'telecine fun', 'telecine touch', 'telecine cult',
      'telecine 1', 'telecine 2', 'telecine 3', 'telecine 4', 'telecine 5',
      'tnt hd', 'tnt fhd', 'tnt 2', 'tnt 3', 'tnt series',
      'space hd', 'space fhd', 'space 2',
      'amc hd', 'amc 2', 'sony hd', 'sony 2', 'warner hd', 'warner 2',
      'fx hd', 'fx 2', 'universal hd', 'universal 2', 'studio universal',
      'megapix hd', 'megapix 2', 'cinemax hd', 'cinemax 2',
      'hbo 2', 'hbo 3', 'hbo plus', 'hbo family', 'hbo signature',
      'paramount 2', 'paramount 3',
      'runtime ação hd', 'runtime comédia hd', 'runtime família',
      'runtime romance', 'cine espanto', 'runtime crime',
      'filmelier tv', 'hallo! classic', 'hallo! movies', 'hallo! series',
      'classique tv series', 'bangbang', 'cinerama',
      'Filmes', 'FILMES', 'Series', 'SERIES', 'Séries', 'SÉRIES',
      'Telecine', 'TELECINE', 'Space', 'SPACE', 'TNT', 'Tnt',
      'HBO', 'Hbo', 'AMC', 'Amc', 'Sony', 'SONY', 'Warner', 'WARNER',
      'FX', 'Fx', 'Universal', 'UNIVERSAL', 'Megapix', 'MEGAPIX',
      'Cinemax', 'CINEMAX', 'Paramount', 'PARAMOUNT', 'Movies', 'MOVIES',
      'HBO Max', 'HBO MAX', 'hbo max', 'MAX', 'Max', 'max hd',
      'HBO Mundi', 'HBO MUNDI', 'hbo mundi', 'HBO Mundi HD', 'hbo mundi hd',
      'TNT Series', 'TNT SERIES', 'tnt series', 'TNT Series HD', 'tnt series hd',
      'Warner Channel', 'WARNER CHANNEL', 'warner channel', 'Warner Channel HD',
      'Canal Sony', 'CANAL SONY', 'canal sony', 'Canal Sony HD', 'canal sony hd',
      'AXN', 'axn', 'AXN HD', 'axn hd', 'AXN White', 'axn white',
      'FX HD', 'fx hd', 'FXM', 'fxm', 'FX Series', 'fx series',
      'Studio Universal', 'STUDIO UNIVERSAL', 'studio universal hd',
      'Universal TV', 'UNIVERSAL TV', 'universal tv', 'Universal TV HD',
      'Syfy', 'SYFY', 'syfy', 'Syfy HD', 'syfy hd',
      'Lifetime', 'LIFETIME', 'lifetime', 'Lifetime HD', 'lifetime hd',
      'Sony Spin', 'SONY SPIN', 'sony spin', 'Sony Spin HD', 'sony spin hd',
      'Sony Action', 'SONY ACTION', 'sony action', 'Sony Action HD',
      'Canal Hollywood', 'CANAL HOLLYWOOD', 'canal hollywood', 'Canal Hollywood HD',
      'Cinemax HD', 'CINEMAX HD', 'cinemax hd', 'Cinemax FHD', 'cinemax fhd',
      'Megapix', 'MEGAPIX', 'megapix', 'Megapix HD', 'megapix hd',
      'Paramount Network', 'PARAMOUNT NETWORK', 'paramount network',
      'Paramount Network HD', 'paramount network hd',
      'Paramount Channel', 'PARAMOUNT CHANNEL', 'paramount channel',
      'AMC HD', 'amc hd', 'AMC FHD', 'amc fhd',
      'Space HD', 'space hd', 'Space FHD', 'space fhd',
      'Runtime TV', 'RUNTIME TV', 'runtime tv', 'Runtime Ação', 'runtime ação',
      'Runtime Comédia', 'runtime comédia', 'Runtime Família', 'runtime família',
      'Runtime Romance', 'runtime romance', 'Runtime Crime', 'runtime crime',
      'Cine Espanto', 'CINE ESPANTO', 'cine espanto',
      'Filmelier', 'FILMELIER', 'filmelier', 'Filmelier TV', 'filmelier tv',
      'Tela Brasil', 'TELA BRASIL', 'tela brasil', 'Tela Brasil TV', 'tela brasil tv',
      'Cine Brasil', 'CINE BRASIL', 'cine brasil', 'Cine Brasil HD', 'cine brasil hd',
      'TV Nova Play', 'TV NOVA PLAY', 'tv nova play',
      'HTO Filmes', 'HTO FILMES', 'hto filmes',
      'DarkFlix', 'DARKFLIX', 'darkflix', 'Dark Flix', 'dark flix',
      'Bora Filmes', 'BORA FILMES', 'bora filmes',
      'Cine Monde', 'CINE MONDE', 'cine monde',
      'Channel One', 'CHANNEL ONE', 'channel one',
      'MyTime Movies', 'MYTIME MOVIES', 'mytime movies',
      'Movie Sphere', 'MOVIE SPHERE', 'movie sphere',
      'Bangbang TV', 'BANGBANG TV', 'bangbang tv', 'BangBang', 'bangbang',
      'Cinerama', 'CINERAMA', 'cinerama',
      'Dorama', 'DORAMA', 'dorama |', 'dorama hd',
      'Série', 'SÉRIE', 'série |', 'series hd',
      'Telecine Pipoca', 'TELECINE PIPOCA', 'telecine pipoca',
      'Telecine Premium', 'TELECINE PREMIUM', 'telecine premium',
      'Telecine Action', 'TELECINE ACTION', 'telecine action',
      'Telecine Fun', 'TELECINE FUN', 'telecine fun',
      'Telecine Touch', 'TELECINE TOUCH', 'telecine touch',
      'Telecine Cult', 'TELECINE CULT', 'telecine cult',
      'Telecine HD', 'TELECINE HD', 'telecine hd',
      'Telecine FHD', 'TELECINE FHD', 'telecine fhd',
      'Telecine 4K', 'TELECINE 4K', 'telecine 4k',
      'Telecine 1 HD', 'Telecine 2 HD', 'Telecine 3 HD', 'Telecine 4 HD', 'Telecine 5 HD',
      'telecine 1 hd', 'telecine 2 hd', 'telecine 3 hd', 'telecine 4 hd', 'telecine 5 hd',
      'TELECINE 1 HD', 'TELECINE 2 HD', 'TELECINE 3 HD', 'TELECINE 4 HD', 'TELECINE 5 HD',
      'Telecine²', 'Telecine³', 'Telecine⁴', 'Telecine⁵',
      'telecine²', 'telecine³', 'telecine⁴', 'telecine⁵',
      'HBO²', 'HBO³', 'HBO⁴', 'HBO⁵', 'hbo²', 'hbo³', 'hbo⁴', 'hbo⁵',
      'TNT²', 'TNT³', 'TNT⁴', 'TNT⁵', 'tnt²', 'tnt³', 'tnt⁴', 'tnt⁵',
      'AMC²', 'AMC³', 'AMC⁴', 'AMC⁵', 'amc²', 'amc³', 'amc⁴', 'amc⁵',
      'Space²', 'Space³', 'Space⁴', 'Space⁵', 'space²', 'space³', 'space⁴', 'space⁵',
      'Hallo! Classic', 'HALLO! CLASSIC', 'hallo! classic',
      'Hallo! Movies', 'HALLO! MOVIES', 'hallo! movies',
      'Hallo! Series', 'HALLO! SERIES', 'hallo! series',
      'Classique TV', 'CLASSIQUE TV', 'classique tv series'
    ]
  },
  {
    id: 'cat_noticias',
    name: 'Notícias',
    keywords: [
      'notícias', 'noticias', 'news', 'cnn', 'canais | notícias', 'tvd news',
      'bm&c news', 'times brasil', 'jp news', 'cnn brasil', 'globo news',
      'band news', 'avança brasil', '4 por 4', 'resumo da ópera', '011 news',
      'record news', 'tv câmera', 'tv senado', 'tv justiça', 'canal gov',
      'tv videonews', 'globonews hd', 'bandnews hd', 'record news hd',
      'cultura news', 'euronews', 'france 24', 'dw brasil', 'tv brasil news',
      'rede tv news', 'sbt news', 'tv 247', 'brasil 247',
      'jovem pan news', 'jovem pan 2', 'jovem pan 3',
      'Notícias', 'NOTÍCIAS', 'Noticias', 'NOTICIAS', 'News', 'NEWS',
      'CNN', 'Cnn', 'CNN Brasil', 'CNN BRASIL', 'CNN Brasil HD', 'CNN BRASIL HD',
      'Globo News', 'GLOBO NEWS', 'GloboNews', 'GLOBONEWS',
      'GloboNews HD', 'GLOBONEWS HD', 'globonews hd',
      'Band News', 'BAND NEWS', 'BandNews', 'BANDNEWS',
      'BandNews HD', 'BANDNEWS HD', 'bandnews hd', 'Band News HD',
      'Record News', 'RECORD NEWS', 'RecordNews', 'RECORDNEWS',
      'Record News HD', 'RECORD NEWS HD', 'recordnews hd',
      'TV Câmara', 'TV CÂMARA', 'TV Senado', 'TV SENADO',
      'TV Justiça', 'TV JUSTIÇA',
      'Jovem Pan', 'JOVEM PAN', 'Jovem Pan News', 'JOVEM PAN NEWS',
      'Jovem Pan News HD', 'JOVEM PAN NEWS HD', 'jovem pan news hd',
      'JP News', 'JP NEWS', 'jp news hd', 'JP NEWS HD',
      'BM&C NEWS', 'bm&c news', 'BM&C NEWS HD', 'bm&c news hd',
      'Times Brasil', 'TIMES BRASIL', 'times brasil hd',
      'Pluto TV Canal UOL', 'Canal UOL HD',
      '4 POR 4', 'Resumo da Ópera', '011 News HD',
      'TV Câmera HD', 'TV Senado HD', 'Canal GOV', 'TV VIDEONEWS',
      'TVD News FHD', 'TVD NEWS FHD',
      'EuroNews', 'EURONEWS', 'euronews', 'EuroNews HD', 'euronews hd',
      'France 24', 'FRANCE 24', 'france 24', 'France 24 HD', 'france 24 hd',
      'France 24 Portuguese', 'France 24 Português', 'FRANCE 24 PORTUGUÊS',
      'DW Brasil', 'DW BRASIL', 'dw brasil', 'DW Brasil HD', 'dw brasil hd',
      'DW Deutsch', 'DW DEUTSCH', 'Deutsche Welle', 'DEUTSCHE WELLE',
      'TV Brasil', 'TV BRASIL', 'tv brasil', 'TV Brasil HD', 'tv brasil hd',
      'TV Brasil 2', 'tv brasil 2', 'TV Brasil Central', 'tv brasil central',
      'TV 247', 'TV247', 'tv 247', 'tv247', 'TV 247 HD', 'tv 247 hd',
      'Brasil 247', 'BRASIL 247', 'brasil 247', 'Brasil 247 HD',
      'Rede TV News', 'REDE TV NEWS', 'rede tv news', 'RedeTV News',
      'SBT News', 'SBT NEWS', 'sbt news', 'SBT News HD', 'sbt news hd',
      'CNN International', 'CNN INTERNATIONAL', 'cnn international',
      'CNN International HD', 'cnn international hd',
      'Sky News', 'SKY NEWS', 'sky news', 'Sky News HD', 'sky news hd',
      'BBC News', 'BBC NEWS', 'bbc news', 'BBC News Brasil', 'BBC NEWS BRASIL',
      'bbc news brasil', 'BBC News HD', 'bbc news hd',
      'Al Jazeera', 'AL JAZEERA', 'al jazeera', 'Al Jazeera HD', 'al jazeera hd',
      'Bloomberg', 'BLOOMBERG', 'bloomberg', 'Bloomberg HD', 'bloomberg hd',
      'CNBC', 'cnbc', 'CNBC HD', 'cnbc hd', 'CNBC Brasil', 'cnbc brasil',
      'NTN24', 'ntn24', 'NTN 24', 'ntn 24', 'NTN24 HD', 'ntn24 hd',
      'Canal Gov', 'CANAL GOV', 'canal gov', 'Canal Gov HD', 'canal gov hd',
      'TV Câmara HD', 'TV CÂMARA HD', 'tv câmara hd',
      'TV Senado HD', 'TV SENADO HD', 'tv senado hd',
      'TV Justiça HD', 'TV JUSTIÇA HD', 'tv justiça hd',
      'Rede Minas', 'REDE MINAS', 'rede minas', 'Rede Minas HD',
      'Meio Norte', 'MEIO NORTE', 'meio norte', 'Rede Meio Norte',
      'Avança Brasil', 'AVANÇA BRASIL', 'avança brasil',
      'TVD News', 'TVD NEWS', 'tvd news', 'TVD News HD', 'tvd news hd',
      'TV Videonews', 'TV VIDEONEWS', 'tv videonews'
    ]
  },
  {
    id: 'cat_infantil',
    name: 'Infantil',
    keywords: [
      'infantil', 'kids', 'cartoon', 'nick', 'canais | infantil', 'bob esponja',
      'pluto tv junior', 'o reino infantil', 'nick clássico', 'babyfirst',
      'super zoe', 'rugrats', 'os padrinhos mágicos', 'patrulha canina',
      'clouding', 'kid mais', 'kuriakos kids', 'toon googles',
      'os jetsons', 'rakuten família', 'nickelodeon', 'nick jr',
      'tv ra tim bum', 'cartoon network', 'cartoonito', 'tru tv',
      'fox kids', 'tv gallo', 'tooncast', 'discovery kids', 'zoomoo',
      'léo e lully', 'retro cartoon', 'tvzyn', 'talking tom',
      'universo kids', 'dream works', 'd.p.a', 'mr bean animated',
      'dcpc infantil', 'adult swim', 'ministério infantil tv',
      'nick hd', 'nick fhd', 'nick 2', 'nick 3',
      'cartoon network hd', 'cartoon network 2', 'cartoon network 3',
      'discovery kids hd', 'discovery kids 2',
      'disney channel', 'disney hd', 'disney 2', 'disney 3',
      'disney junior', 'disney xd', 'disney xd 2',
      'gloob', 'gloob hd', 'gloob 2', 'boomerang', 'boomerang hd',
      'boomerang 2', 'nicktoons',
      'Infantil', 'INFANTIL', 'Kids', 'KIDS', 'Cartoon', 'CARTOON',
      'Nick', 'NICK', 'Nickelodeon', 'NICKELODEON', 'Nick Jr', 'NICK JR',
      'Cartoon Network', 'CARTOON NETWORK', 'Discovery Kids', 'DISCOVERY KIDS',
      'Disney', 'DISNEY', 'Disney Channel', 'DISNEY CHANNEL',
      'Disney Junior', 'DISNEY JUNIOR', 'Disney XD', 'DISNEY XD',
      'Gloob', 'GLOOB', 'Boomerang', 'BOOMERANG',
      'NICK HD', 'NICK FHD', 'NICK 4K', 'NICKELODEON HD', 'NICKELODEON FHD',
      'CARTOON NETWORK HD', 'CARTOON NETWORK FHD', 'CARTOON NETWORK 4K',
      'DISCOVERY KIDS HD', 'DISCOVERY KIDS FHD', 'DISCOVERY KIDS 4K',
      'DISNEY CHANNEL HD', 'DISNEY CHANNEL FHD', 'DISNEY CHANNEL 4K',
      'DISNEY JUNIOR HD', 'DISNEY JUNIOR FHD', 'DISNEY JUNIOR 4K',
      'DISNEY XD HD', 'DISNEY XD FHD', 'DISNEY XD 4K',
      'GLOOB HD', 'GLOOB FHD', 'GLOOB 4K',
      'BOOMERANG HD', 'BOOMERANG FHD', 'BOOMERANG 4K',
      'Nick²', 'Nick³', 'Nick⁴', 'Nick⁵',
      'Cartoon Network²', 'Cartoon Network³', 'Cartoon Network⁴',
      'Discovery Kids²', 'Discovery Kids³', 'Discovery Kids⁴',
      'Disney²', 'Disney³', 'Disney⁴', 'Disney⁵',
      'Disney Channel²', 'Disney Channel³', 'Disney Channel⁴',
      'Gloob²', 'Gloob³', 'Gloob⁴', 'Gloob⁵',
      'NICK 1', 'NICK 2', 'NICK 3', 'NICK 4', 'NICK 5',
      'CARTOON NETWORK 1', 'CARTOON NETWORK 4', 'CARTOON NETWORK 5',
      'DISNEY 1', 'DISNEY 4', 'DISNEY 5',
      'Disney+', 'DISNEY+', 'disney+', 'Disney Plus', 'DISNEY PLUS',
      'TV Ra Tim Bum', 'TV RA TIM BUM', 'tv ra tim bum', 'TV Rá Tim Bum',
      'Gloobinho', 'GLOOBINHO', 'gloobinho',
      'PinKids', 'PINKIDS', 'pinkids', 'Pink Kids', 'PINK KIDS', 'pink kids',
      'NickToons', 'NICKTOONS', 'nicktoons', 'NickToons HD', 'nicktoons hd',
      'Cartoon Network Too', 'CARTOON NETWORK TOO', 'cartoon network too',
      'CN Too', 'CN TOO', 'cn too', 'Cartoonito', 'CARTOONITO', 'cartoonito',
      'Baby First', 'BABY FIRST', 'baby first', 'BabyFirst', 'BABYFIRST',
      'ToonCast', 'TOONCAST', 'tooncast', 'ToonCast HD', 'tooncast hd',
      'Zoomoo', 'ZOOMOO', 'zoomoo', 'Zoomoo HD', 'zoomoo hd',
      'ZooBoom', 'ZOOBOOM', 'zooboom',
      'Kingdom Kids', 'KINGDOM KIDS', 'kingdom kids',
      'Universo Kids', 'UNIVERSO KIDS', 'universo kids',
      'Super ZOE', 'SUPER ZOE', 'super zoe',
      'O Reino Infantil', 'O REINO INFANTIL', 'o reino infantil',
      'Kid Mais', 'KID MAIS', 'kid mais',
      'Clouding', 'CLOUDING', 'clouding',
      'Kuriakos Kids', 'KURIAKOS KIDS', 'kuriakos kids',
      'Toon Googles', 'TOON GOOGLES', 'toon googles',
      'Léo e Lully', 'LÉO E LULLY', 'léo e lully',
      'DCPC Infantil', 'DCPC INFANTIL', 'dcpc infantil',
      'Ministério Infantil', 'MINISTÉRIO INFANTIL', 'ministério infantil tv',
      'DreamWorks', 'DREAMWORKS', 'dreamworks', 'DreamWorks HD', 'dreamworks hd',
      'D.P.A', 'd.p.a', 'DPA', 'dpa',
      'Talking Tom', 'TALKING TOM', 'talking tom',
      'Rakuten Família', 'RAKUTEN FAMÍLIA', 'rakuten família',
      'Adult Swim', 'ADULT SWIM', 'adult swim', 'Adult Swim HD', 'adult swim hd'
    ]
  },
  {
    id: 'cat_animes',
    name: 'Animes & Geek',
    keywords: [
      'animes', 'geek', 'loading', 'canais | animes & geek', 'dragon ball',
      'cavaleiros dos zodiacos', 'naruto', 'anime tv', 'crunchyroll',
      'funimation', 'otaku', 'manga', 'pokemon', 'one piece', 'attack on titan',
      'my hero academia', 'demon slayer', 'jojo bizarre', 'bleach',
      'hunter x hunter',
      'Anime', 'ANIME', 'anime', 'Animes', 'ANIMES',
      'Crunchyroll', 'CRUNCHYROLL', 'crunchyroll hd',
      'Funimation', 'FUNIMATION', 'funimation hd',
      'Anime TV', 'ANIME TV', 'anime tv hd',
      'Loading TV', 'LOADING TV', 'loading tv',
      'Otaku', 'OTAKU', 'otaku hd',
      'Dragon Ball', 'DRAGON BALL', 'dragon ball hd',
      'Naruto', 'NARUTO', 'naruto hd',
      'One Piece', 'ONE PIECE', 'one piece hd',
      'Attack On Titan', 'ATTACK ON TITAN', 'attack on titan hd',
      'Pokemon', 'POKEMON', 'Pokémon', 'POKÉMON', 'pokemon hd',
      'Geek Channel', 'GEEK CHANNEL', 'geek channel',
      'Anime Sign', 'ANIME SIGN', 'anime sign', 'OtakuSign', 'OTAKUSIGN', 'otaku sign tv',
      'AnimeFire', 'ANIMEFIRE', 'animefire',
      'Cavaleiros dos Zodíacos', 'CAVALEIROS DOS ZODÍACOS', 'cavaleiros do zodiaco',
      'Saint Seiya', 'SAINT SEIYA', 'saint seiya',
      'Demon Slayer', 'DEMON SLAYER', 'demon slayer',
      'JoJo', 'JOJO', 'jojo bizarre',
      'Bleach', 'BLEACH', 'bleach hd',
      'Hunter x Hunter', 'HUNTER X HUNTER', 'hunter x hunter',
      'My Hero Academia', 'MY HERO ACADEMIA', 'my hero academia',
      'Sword Art Online', 'SWORD ART ONLINE', 'sword art online',
      'Re:Zero', 'RE:ZERO', 're:zero',
      'Overlord', 'OVERLORD', 'overlord',
      'Tokyo Ghoul', 'TOKYO GHOUL', 'tokyo ghoul',
      'Fairy Tail', 'FAIRY TAIL', 'fairy tail',
      'Full Metal Alchemist', 'FULL METAL ALCHEMIST', 'full metal alchemist',
      'Death Note', 'DEATH NOTE', 'death note',
      'Dorama', 'DORAMA', 'dorama', 'dorama |', 'dorama hd',
      'K-Drama', 'K-DRAMA', 'k-drama', 'kdrama', 'KDRAMA',
      'Canal Geek', 'CANAL GEEK', 'canal geek', 'Canal Geek HD'
    ]
  },
  {
    id: 'cat_musica',
    name: 'Música',
    keywords: [
      'música', 'musica', 'music', 'mtv', 'canais | música', 'mtv flow latino',
      'top tv', 'rede sulamérica tv', 'maisum', 'music top', 'canal 019',
      'pop pegajoso', 'kiss tv', 'hallo music', 'gospel music tv',
      'hip hop vai além', 'rádio', 'radio', 'pisadinha', 'k-pop', 'pop',
      'energia 97', 'gospel internacional', 'rádio salvador', 'antena 1',
      'brado rádio', 'gavião fm', 'rádio muriaé', 'web rádio jp',
      'mtv hd', 'mtv fhd', 'mtv 2', 'mtv 3', 'mtv hits',
      'vh1', 'vh1 hd', 'vh1 2', 'vh1 classic', 'music box', 'music choice',
      'vevo', 'stingray music', 'multishow hd', 'multishow 2',
      'bis hd', 'bis 2', 'woohoo hd', 'woohoo 2',
      'trace urban', 'trace gospel', 'trace latina',
      'MTV', 'Mtv', 'MTV HD', 'MTV FHD', 'MTV 4K', 'MTV BRASIL', 'mtv brasil',
      'VH1', 'Vh1', 'VH1 HD', 'VH1 FHD', 'VH1 4K',
      'MULTISHOW', 'Multishow', 'MULTISHOW HD', 'MULTISHOW FHD', 'MULTISHOW 4K',
      'BIS', 'Bis', 'BIS HD', 'BIS FHD', 'BIS 4K',
      'MUSIC BOX', 'music box', 'Music Box',
      'VEVO', 'vevo', 'Vevo',
      'KISS FM', 'kiss fm', 'Kiss FM', 'Kiss TV', 'KISS TV', 'kiss tv',
      'ENERGIA 97', 'energia 97', 'Energia 97',
      'MTV²', 'MTV³', 'MTV⁴', 'MTV⁵', 'VH1²', 'VH1³', 'VH1⁴', 'VH1⁵',
      'BIS²', 'BIS³', 'BIS⁴', 'BIS⁵',
      'MTV 1', 'MTV 4', 'MTV 5', 'VH1 1', 'VH1 3', 'VH1 4', 'VH1 5',
      'MTV Live', 'MTV LIVE', 'MTV Hits', 'MTV HITS', 'MTV Hits HD',
      'VH1 Classic', 'VH1 CLASSIC', 'VH1 Classics', 'VH1 Mega Hits',
      'Trace Urban', 'TRACE URBAN', 'trace urban', 'Trace Urban HD',
      'Trace Gospel', 'TRACE GOSPEL', 'trace gospel', 'Trace Gospel HD',
      'Trace Latina', 'TRACE LATINA', 'trace latina', 'Trace Latina HD',
      'Trace Sport Stars', 'TRACE SPORT STARS', 'trace sport stars',
      'Woohoo', 'WOOHOO', 'woohoo', 'Woohoo HD', 'woohoo hd',
      'Antena 1', 'ANTENA 1', 'antena 1', 'Antena 1 HD', 'antena 1 hd',
      'Rádio', 'RÁDIO', 'Radio', 'RADIO',
      'Jovem Pan FM', 'JOVEM PAN FM', 'jovem pan fm',
      'Rock in Rio', 'ROCK IN RIO', 'rock in rio',
      'Pop TV', 'POP TV', 'pop tv', 'Pop TV HD', 'pop tv hd',
      'Música Pop', 'MÚSICA POP', 'música pop',
      'Pisadinha', 'PISADINHA', 'pisadinha', 'Pisadinha TV', 'pisadinha tv',
      'Sertanejo', 'SERTANEJO', 'sertanejo', 'Sertanejo TV', 'sertanejo tv',
      'Gospel', 'GOSPEL', 'gospel', 'Gospel TV', 'gospel tv',
      'K-Pop', 'K-POP', 'k-pop', 'KPop', 'KPOP', 'kpop',
      'Hip Hop', 'HIP HOP', 'hip hop', 'Hip Hop TV', 'hip hop tv',
      'Reggae', 'REGGAE', 'reggae', 'Reggae TV', 'reggae tv',
      'Pagode', 'PAGODE', 'pagode', 'Pagode TV', 'pagode tv',
      'Forró', 'FORRÓ', 'forró', 'Forró TV', 'forró tv',
      'Axé', 'AXÉ', 'axé', 'Axé TV', 'axé tv',
      'Funk', 'FUNK', 'funk', 'Funk TV', 'funk tv',
      'Maisum', 'MAISUM', 'maisum', 'Maisum HD', 'maisum hd',
      'Music Top', 'MUSIC TOP', 'music top', 'Music Top HD',
      'Canal 019', 'CANAL 019', 'canal 019',
      'Pop Pegajoso', 'POP PEGAJOSO', 'pop pegajoso',
      'Hallo Music', 'HALLO MUSIC', 'hallo music',
      'Gospel Internacional', 'GOSPEL INTERNACIONAL', 'gospel internacional',
      'Stingray Music', 'STINGRAY MUSIC', 'stingray music',
      'Music Choice', 'MUSIC CHOICE', 'music choice',
      'Rede Sulamérica', 'REDE SULAMÉRICA', 'rede sulamérica tv',
      'Top TV', 'TOP TV', 'top tv'
    ]
  },
  {
    id: 'cat_variedades',
    name: 'Variedades & Discovery',
    keywords: [
      'variedades', 'discovery', 'animal', 'food', 'investigação',
      'canais | variedades', 'canais | reality', 'multishow', 'mtv', 'bis',
      'comedy central', 'tbs', 'canal brasil', 'e!', 'prime box', 'arte 1',
      'film & arts', 'tlc', 'gnt', 'modo viagem', 'receita fast', 'hallo doc',
      'discovery turbo', 'id', 'animal planet', 'rakuten documentários',
      'pluto tv investigação', 'revry brasil', 'whe play', 'royalworld',
      'viajando pelo brasil', 'diatv', 'fit dance', 'cultne tv',
      'salon line', 'tratamento de choque',
      'discovery hd', 'discovery fhd', 'discovery 2', 'discovery 3',
      'discovery channel', 'discovery science', 'discovery civilization',
      'discovery theater', 'animal planet hd', 'animal planet 2',
      'national geographic', 'nat geo hd', 'nat geo 2', 'nat geo wild',
      'history channel', 'history hd', 'history 2', 'h2',
      'Discovery Turbo HD', 'DISCOVERY TURBO HD', 'discovery turbo hd',
      'Discovery Theater', 'DISCOVERY THEATER', 'Discovery Science',
      'DISCOVERY SCIENCE', 'Discovery Home & Health', 'DISCOVERY HOME & HEALTH',
      'National Geographic HD', 'NATIONAL GEOGRAPHIC HD',
      'Animal Planet HD', 'ANIMAL PLANET HD',
      'History Channel HD', 'HISTORY CHANNEL HD',
      'COMEDY CENTRAL', 'Comedy Central', 'comedy central hd', 'Comedy Central HD',
      'ID Investigação', 'ID INVESTIGAÇÃO', 'id investigação',
      'TLC HD', 'TLC FHD', 'TLC 4K', 'A&E', 'a&e', 'A&E HD',
      'LIFETIME', 'Lifetime', 'lifetime', 'Lifetime HD', 'LIFETIME HD',
      'Discovery', 'DISCOVERY', 'Discovery Channel', 'DISCOVERY CHANNEL',
      'Discovery HD', 'DISCOVERY HD', 'Discovery FHD', 'DISCOVERY FHD',
      'Discovery 4K', 'DISCOVERY 4K', 'Discovery Science', 'DISCOVERY SCIENCE',
      'Discovery Science HD', 'DISCOVERY SCIENCE HD', 'discovery science hd',
      'Discovery Turbo', 'DISCOVERY TURBO', 'Discovery Turbo HD', 'DISCOVERY TURBO HD',
      'Discovery Theater', 'DISCOVERY THEATER', 'Discovery Theater HD',
      'Discovery Home & Health', 'Discovery Home and Health', 'DISCOVERY HOME',
      'discovery home & health', 'discovery home hd',
      'Discovery Civilization', 'DISCOVERY CIVILIZATION', 'discovery civilization',
      'Discovery World', 'DISCOVERY WORLD', 'discovery world',
      'Discovery Kids', 'DISCOVERY KIDS', 'discovery kids',
      'Animal Planet', 'ANIMAL PLANET', 'animal planet',
      'Animal Planet HD', 'ANIMAL PLANET HD', 'animal planet hd',
      'Animal Planet FHD', 'ANIMAL PLANET FHD', 'animal planet fhd',
      'National Geographic', 'NATIONAL GEOGRAPHIC', 'national geographic',
      'National Geographic HD', 'NATIONAL GEOGRAPHIC HD', 'national geographic hd',
      'Nat Geo', 'NAT GEO', 'nat geo', 'Nat Geo HD', 'NAT GEO HD', 'nat geo hd',
      'Nat Geo Wild', 'NAT GEO WILD', 'nat geo wild', 'Nat Geo Wild HD',
      'History', 'HISTORY', 'history', 'History Channel', 'HISTORY CHANNEL',
      'History HD', 'HISTORY HD', 'history hd', 'History FHD', 'HISTORY FHD',
      'History 4K', 'HISTORY 4K', 'history 4k', 'H2', 'h2', 'H2 HD', 'h2 hd',
      'Military History', 'MILITARY HISTORY', 'military history',
      'ID', 'id', 'ID Channel', 'ID CHANNEL', 'id channel',
      'Investigation Discovery', 'INVESTIGATION DISCOVERY', 'investigation discovery',
      'ID Investigação', 'ID INVESTIGAÇÃO', 'id investigação',
      'TLC', 'tlc', 'TLC HD', 'TLC FHD', 'TLC 4K',
      'A&E', 'a&e', 'A&E HD', 'a&e hd', 'A&E FHD', 'A&E 4K',
      'Lifetime', 'LIFETIME', 'lifetime', 'Lifetime HD', 'Lifetime FHD',
      'Biography', 'BIOGRAPHY', 'biography', 'Bio Channel', 'BIO CHANNEL',
      'Comedy Central', 'COMEDY CENTRAL', 'comedy central',
      'Comedy Central HD', 'COMEDY CENTRAL HD', 'comedy central hd',
      'Comedy Central FHD', 'COMEDY CENTRAL FHD',
      'TBS', 'tbs', 'TBS HD', 'tbs hd', 'TBS Entretenimento', 'TBS ENTRETENIMENTO',
      'Canal Brasil', 'CANAL BRASIL', 'canal brasil',
      'Canal Brasil HD', 'CANAL BRASIL HD', 'canal brasil hd',
      'E!', 'e!', 'E! Entertainment', 'E! ENTERTAINMENT',
      'E! HD', 'e! hd', 'E! FHD', 'E! 4K',
      'Arte 1', 'ARTE 1', 'arte 1', 'Arte 1 HD', 'ARTE 1 HD', 'arte 1 hd',
      'Film & Arts', 'FILM & ARTS', 'film & arts', 'Film Arts', 'film arts',
      'GNT', 'gnt', 'GNT HD', 'GNT FHD', 'GNT 4K',
      'Prime Box', 'PRIME BOX', 'prime box', 'Prime Box HD', 'prime box hd',
      'Viasat Explore', 'VIASAT EXPLORE', 'viasat explore',
      'Viasat Nature', 'VIASAT NATURE', 'viasat nature',
      'Viasat History', 'VIASAT HISTORY', 'viasat history',
      'Futurism', 'FUTURISM', 'futurism',
      'Modo Viagem', 'MODO VIAGEM', 'modo viagem', 'Modo Viagem HD',
      'Receita Fast', 'RECEITA FAST', 'receita fast',
      'Hallo Doc', 'HALLO DOC', 'hallo doc',
      'Revry Brasil', 'REVRY BRASIL', 'revry brasil',
      'Rakuten Documentários', 'RAKUTEN DOCUMENTÁRIOS', 'rakuten documentários',
      'Pluto TV Investigação', 'PLUTO TV INVESTIGAÇÃO', 'pluto tv investigação',
      'FIT Dance', 'FIT DANCE', 'fit dance',
      'CultNE TV', 'CULTNE TV', 'cultne tv',
      'Salon Line', 'SALON LINE', 'salon line',
      'Tratamento de Choque', 'TRATAMENTO DE CHOQUE', 'tratamento de choque',
      'DiaTV', 'DIATV', 'diatv',
      'RoyalWorld', 'ROYALWORLD', 'royalworld',
      'Viajando pelo Brasil', 'VIAJANDO PELO BRASIL', 'viajando pelo brasil',
      'WhePlay', 'WHEPLAY', 'whe play'
    ]
  },
  {
    id: 'cat_novelas',
    name: 'Novelas',
    keywords: [
      'novelas', 'televisa', 'telenovelas', 'canais | novelas', 'globoplay novelas',
      'a terra prometida', 'os dez mandamentos', 'malhação fast', 'a escrava isaura',
      'tvi ficção', 'sic novelas', 'sony novelas', 'viva hd', 'viva fhd',
      'canal viva', 'globo premium', 'sbt novelas', 'record novelas',
      'mega pix', 'megapix novelas', 'tlnovelas', 'pasiones', 'de pelicula',
      'univision novelas',
      'Novelas', 'NOVELAS', 'Novela', 'NOVELA', 'Telenovela', 'TELENOVELA',
      'Canal Viva', 'CANAL VIVA', 'canal viva', 'Canal Viva HD', 'canal viva hd',
      'Viva', 'VIVA', 'viva', 'Viva HD', 'VIVA HD', 'viva hd',
      'TLNovelas', 'TLNOVELAS', 'tlnovelas', 'TLNovelas HD', 'tlnovelas hd',
      'Pasiones', 'PASIONES', 'pasiones', 'Pasiones HD', 'pasiones hd',
      'De Película', 'DE PELÍCULA', 'de pelicula', 'De Película HD',
      'SIC Novelas', 'SIC NOVELAS', 'sic novelas', 'SIC Novelas HD',
      'SIC', 'sic', 'SIC HD', 'sic hd', 'SIC International', 'sic international',
      'TVI', 'tvi', 'TVI HD', 'tvi hd', 'TVI Ficção', 'TVI FICÇÃO', 'tvi ficção',
      'RTP', 'rtp', 'RTP HD', 'rtp hd', 'RTP 1', 'RTP 2', 'RTP Internacional',
      'rtp 1', 'rtp 2', 'rtp internacional', 'RTP Internacional HD',
      'Univision', 'UNIVISION', 'univision', 'Univision HD', 'univision hd',
      'Televisa', 'TELEVISA', 'televisa', 'Televisa HD', 'televisa hd',
      'Megapix', 'MEGAPIX', 'megapix', 'Megapix HD', 'megapix hd',
      'Globo Premium', 'GLOBO PREMIUM', 'globo premium',
      'Sony Novelas', 'SONY NOVELAS', 'sony novelas',
      'SBT Novelas', 'SBT NOVELAS', 'sbt novelas',
      'Record Novelas', 'RECORD NOVELAS', 'record novelas',
      'Escrava Isaura', 'ESCRAVA ISAURA', 'a escrava isaura',
      'Terra Prometida', 'TERRA PROMETIDA', 'a terra prometida',
      'Dez Mandamentos', 'DEZ MANDAMENTOS', 'os dez mandamentos',
      'Malhação Fast', 'MALHAÇÃO FAST', 'malhação fast',
      'Globoplay Novelas', 'GLOBOPLAY NOVELAS', 'globoplay novelas',
      'Rede Família Novelas', 'novelas gospel'
    ]
  },
  {
    id: 'cat_documentarios',
    name: 'Documentários',
    keywords: [
      'documentário', 'documentarios', 'documentários', 'documental',
      'canais | documentários', 'canais | documentario',
      'Documentário', 'DOCUMENTÁRIO', 'Documentarios', 'DOCUMENTARIOS',
      'Documentary', 'DOCUMENTARY', 'documentary',
      'Rakuten Documentários', 'RAKUTEN DOCUMENTÁRIOS', 'rakuten documentários',
      'Hallo Doc', 'HALLO DOC', 'hallo doc', 'Hallo Doc HD', 'hallo doc hd',
      'Docubox', 'DOCUBOX', 'docubox', 'DocuBox HD', 'docubox hd',
      'History HD', 'HISTORY HD', 'history documentários',
      'National Geographic Documentários', 'NAT GEO DOCUMENTÁRIOS',
      'Discovery Documentários', 'DISCOVERY DOCUMENTÁRIOS',
      'Viasat History', 'VIASAT HISTORY', 'viasat history',
      'Viasat Explore', 'VIASAT EXPLORE', 'viasat explore',
      'Viasat Nature', 'VIASAT NATURE', 'viasat nature',
      'ID Investigação', 'id investigação', 'ID',
      'Crime Investigation', 'CRIME INVESTIGATION', 'crime investigation',
      'Pluto TV Investigação', 'PLUTO TV INVESTIGAÇÃO',
      'Investigation Discovery', 'investigation discovery',
      'Canal Curta!', 'CANAL CURTA!', 'canal curta', 'Canal Curta HD',
      'Curta!', 'CURTA!', 'curta', 'curta hd',
      'Canal Bio', 'CANAL BIO', 'canal bio',
      'Biography', 'BIOGRAPHY', 'biography',
      'Military History', 'MILITARY HISTORY', 'military history'
    ]
  },
  {
    id: 'cat_reality',
    name: 'Reality Shows',
    keywords: [
      'reality', 'masterchef', 'shark tank', 'canais | reality',
      'estrela da casa', 'mtv com o ex', 'Estrela da Casa 1', 'Estrela da Casa 2',
      'Mosaico', 'BBB', 'bbb', 'Big Brother', 'BIG BROTHER', 'big brother',
      'Big Brother Brasil', 'BIG BROTHER BRASIL', 'big brother brasil',
      'A Fazenda', 'A FAZENDA', 'a fazenda', 'Fazenda', 'FAZENDA',
      'MasterChef', 'MASTERCHEF', 'masterchef', 'MasterChef Brasil',
      'MasterChef Junior', 'MasterChef Profissionais',
      'Shark Tank', 'SHARK TANK', 'shark tank', 'Shark Tank Brasil',
      'The Voice', 'THE VOICE', 'the voice', 'The Voice Brasil',
      'The Voice Kids', 'THE VOICE KIDS', 'the voice kids',
      'No Limite', 'NO LIMITE', 'no limite', 'Survivor', 'SURVIVOR',
      'Dancing Brasil', 'DANCING BRASIL', 'dancing brasil',
      'Dance Dance Dance', 'DANCE DANCE DANCE',
      'Dança dos Famosos', 'DANÇA DOS FAMOSOS', 'dança dos famosos',
      'Power Couple', 'POWER COUPLE', 'power couple', 'Power Couple Brasil',
      'De Férias com o Ex', 'DE FÉRIAS COM O EX', 'de férias com o ex',
      'Catfish', 'CATFISH', 'catfish',
      'Amor & Sexo', 'AMOR & SEXO', 'amor & sexo',
      'Extreme Makeover', 'EXTREME MAKEOVER', 'extreme makeover',
      'Hell\'s Kitchen', 'HELL\'S KITCHEN', 'hells kitchen',
      'Top Chef', 'TOP CHEF', 'top chef',
      'Project Runway', 'PROJECT RUNWAY', 'project runway',
      'America\'s Next Top Model', 'Americas Next Top Model',
      'Keeping Up with the Kardashians', 'keeping up with the kardashians',
      'Queer Eye', 'QUEER EYE', 'queer eye',
      'Drag Race', 'DRAG RACE', 'drag race', 'RuPaul',
      'Mosaico HD', 'MOSAICO HD', 'mosaico hd'
    ]
  },
  {
    id: 'cat_comedia',
    name: 'Comédia',
    keywords: [
      'comédia', 'comedia', 'comedy', 'kenan', 'failarmy', 'canais | comédia',
      'porta dos fundos', 'drake e josh', 'friends', 'um maluco no pedaço',
      'os trapalhões', 'todo mundo odeia o cris', 'pegadinhas silvio santos',
      'as visões da raven', 'a grande família', 'escolinha raimundo',
      'eu a patroa e as crianças', 'tô de graça',
      'Comédia', 'COMÉDIA', 'Comedia', 'COMEDIA', 'Comedy', 'COMEDY',
      'Comedy Central', 'COMEDY CENTRAL', 'Comedy Central HD',
      'FailArmy', 'FAILARMY', 'failarmy', 'FailArmy HD', 'failarmy hd',
      'Porta dos Fundos', 'PORTA DOS FUNDOS', 'porta dos fundos',
      'Humor', 'HUMOR', 'humor', 'Humor TV', 'humor tv',
      'Pegadinhas', 'PEGADINHAS', 'pegadinhas',
      'Trapalhões', 'TRAPALHÕES', 'os trapalhões',
      'Grande Família', 'GRANDE FAMÍLIA', 'a grande família',
      'Escolinha', 'ESCOLINHA', 'escolinha raimundo',
      'Tô de Graça', 'TÔ DE GRAÇA', 'tô de graça',
      'South Park', 'SOUTH PARK', 'south park', 'South Park HD',
      'Friends', 'FRIENDS', 'friends',
      'Um Maluco no Pedaço', 'UM MALUCO NO PEDAÇO', 'um maluco no pedaço',
      'Seinfeld', 'SEINFELD', 'seinfeld',
      'The Office', 'THE OFFICE', 'the office',
      'Parks and Recreation', 'PARKS AND RECREATION', 'parks and recreation',
      'Brooklyn Nine-Nine', 'BROOKLYN NINE-NINE', 'brooklyn nine-nine',
      'How I Met Your Mother', 'HOW I MET YOUR MOTHER',
      'Big Bang Theory', 'BIG BANG THEORY', 'big bang theory',
      'Modern Family', 'MODERN FAMILY', 'modern family',
      'It\'s Always Sunny', 'its always sunny', 'Always Sunny',
      'Arrested Development', 'arrested development',
      'Futurama', 'FUTURAMA', 'futurama',
      'Simpsons', 'SIMPSONS', 'simpsons', 'The Simpsons', 'THE SIMPSONS',
      'American Dad', 'AMERICAN DAD', 'american dad',
      'Family Guy', 'FAMILY GUY', 'family guy',
      'Bob\'s Burgers', 'BOBS BURGERS', 'bobs burgers',
      'Drake e Josh', 'DRAKE E JOSH', 'drake e josh',
      'Kenan', 'KENAN', 'kenan',
      'As Visões da Raven', 'as visões da raven',
      'Todo Mundo Odeia o Cris', 'todo mundo odeia o cris',
      'Eu a Patroa e as Crianças', 'eu a patroa e as crianças'
    ]
  },
  {
    id: 'cat_lutas',
    name: 'Lutas & MMA',
    keywords: [
      'lutas', 'fight', 'combat', 'ufc', 'pfl', 'combate', 'ufc fightpass',
      'lucha libre', 'combatv', 'fite', 'sft combat',
      'Lutas', 'LUTAS', 'Fight', 'FIGHT', 'Combat', 'COMBAT',
      'UFC', 'ufc', 'UFC HD', 'ufc hd', 'UFC FHD', 'UFC 4K',
      'UFC Fight Pass', 'UFC FIGHT PASS', 'ufc fight pass', 'UFC FightPass',
      'Combate', 'COMBATE', 'combate', 'Combate HD', 'COMBATE HD', 'combate hd',
      'Combate FHD', 'COMBATE FHD', 'combate fhd',
      'Combate 4K', 'COMBATE 4K', 'combate 4k',
      'PFL', 'pfl', 'PFL HD', 'pfl hd', 'Professional Fighters League',
      'PROFESSIONAL FIGHTERS LEAGUE', 'professional fighters league',
      'Bellator', 'BELLATOR', 'bellator', 'Bellator HD', 'bellator hd',
      'ONE Championship', 'ONE FC', 'one championship', 'one fc', 'ONE Championship HD',
      'SFT', 'sft', 'SFT Combat', 'sft combat', 'SFT HD', 'sft hd',
      'Lucha Libre', 'LUCHA LIBRE', 'lucha libre', 'Lucha Libre HD',
      'WWE', 'wwe', 'WWE HD', 'wwe hd', 'WWE Network', 'wwe network',
      'WWE Raw', 'wwe raw', 'WWE SmackDown', 'wwe smackdown',
      'AEW', 'aew', 'AEW HD', 'aew hd', 'All Elite Wrestling',
      'ROH', 'roh', 'Ring of Honor', 'ring of honor',
      'Boxe', 'BOXE', 'boxe', 'Boxing', 'BOXING', 'boxing', 'Boxe HD',
      'Kickboxing', 'KICKBOXING', 'kickboxing', 'Kickboxing HD',
      'Muay Thai', 'MUAY THAI', 'muay thai', 'Muay Thai HD',
      'Jiu-Jitsu', 'JIU-JITSU', 'jiu-jitsu', 'BJJ', 'bjj',
      'MMA', 'mma', 'MMA HD', 'mma hd', 'Mixed Martial Arts',
      'FITE TV', 'fite tv', 'Fite', 'FITE', 'fite',
      'Combat TV', 'COMBAT TV', 'combat tv', 'CombatTV', 'COMBATTV',
      'Combate²', 'Combate³', 'combate²', 'combate³',
      'COMBATE²', 'COMBATE³', 'COMBATE 1', 'combate 1'
    ]
  },
  {
    id: 'cat_internacional',
    name: 'Internacional',
    keywords: [
      'internacional', 'sic', 'rtp', 'tvi', 'cnn international', 'canais | internacional',
      'eleven sports', 'canal 11', 'tv5 monde', 'fox news now', 'sony canal comedias',
      'deportes', 'wwe youtube', 'europe', 'usa', 'uk', 'spain', 'portugal',
      'france', 'italy', 'germany', 'argentina', 'chile', 'mexico', 'colombia',
      'venezuela', 'uruguay', 'peru', 'ecuador',
      'Internacional', 'INTERNACIONAL', 'International', 'INTERNATIONAL',
      'SIC', 'sic', 'SIC HD', 'sic hd', 'SIC Internacional', 'SIC INTERNACIONAL',
      'sic internacional', 'SIC Internacional HD',
      'SIC Radical', 'SIC RADICAL', 'sic radical', 'SIC Radical HD',
      'SIC Notícias', 'SIC NOTÍCIAS', 'sic notícias', 'SIC Notícias HD',
      'TVI', 'tvi', 'TVI HD', 'tvi hd', 'TVI Internacional', 'TVI INTERNACIONAL',
      'tvi internacional', 'TVI Internacional HD',
      'TVI 24', 'TVI24', 'tvi 24', 'tvi24', 'TVI 24 HD',
      'TVI Ficção', 'TVI FICÇÃO', 'tvi ficção',
      'RTP', 'rtp', 'RTP 1', 'RTP 2', 'rtp 1', 'rtp 2',
      'RTP Internacional', 'RTP INTERNACIONAL', 'rtp internacional',
      'RTP Internacional HD', 'rtp internacional hd', 'RTP Africa', 'RTP AFRICA',
      'RTP HD', 'rtp hd', 'RTP FHD', 'rtp fhd',
      'TV5 Monde', 'TV5MONDE', 'tv5 monde', 'TV5Monde HD', 'tv5monde hd',
      'TV5 Monde HD', 'TV5 MONDE HD', 'tv5 monde hd',
      'France 24', 'FRANCE 24', 'france 24', 'France 24 HD', 'france 24 hd',
      'France 24 Português', 'FRANCE 24 PORTUGUÊS', 'france 24 português',
      'EuroNews', 'EURONEWS', 'euronews', 'EuroNews HD', 'euronews hd',
      'DW Brasil', 'DW BRASIL', 'dw brasil', 'DW', 'dw', 'Deutsche Welle',
      'BBC', 'bbc', 'BBC HD', 'bbc hd', 'BBC Brasil', 'BBC BRASIL', 'bbc brasil',
      'BBC News', 'BBC NEWS', 'bbc news', 'BBC World', 'BBC WORLD', 'bbc world',
      'BBC Entertainment', 'BBC ENTERTAINMENT', 'bbc entertainment',
      'CNN International', 'CNN INTERNATIONAL', 'cnn international', 'CNN International HD',
      'FOX News', 'FOX NEWS', 'fox news', 'Fox News Now', 'fox news now',
      'MSNBC', 'msnbc', 'MSNBC HD', 'msnbc hd',
      'Sky News', 'SKY NEWS', 'sky news', 'Sky News HD', 'sky news hd',
      'Sky Sports', 'SKY SPORTS', 'sky sports', 'Sky Sports HD', 'sky sports hd',
      'BT Sport', 'BT SPORT', 'bt sport', 'BT Sport HD', 'bt sport hd',
      'Eleven Sports', 'ELEVEN SPORTS', 'eleven sports', 'Eleven Sports HD',
      'Canal 11', 'CANAL 11', 'canal 11', 'Canal 11 Portugal', 'canal 11 hd',
      'RAI', 'rai', 'RAI 1', 'RAI 2', 'RAI 3', 'rai 1', 'rai 2', 'rai 3',
      'RAI Italia', 'RAI ITALIA', 'rai italia', 'RAI International', 'rai international',
      'ARD', 'ard', 'ARD HD', 'ZDF', 'zdf', 'ZDF HD', 'ZDF International',
      'RTL', 'rtl', 'RTL HD', 'RTL Deutschland', 'RTL Group',
      'TVE', 'tve', 'TVE Internacional', 'TVE INTERNACIONAL', 'tve internacional',
      'TVE Internacional HD', 'tve internacional hd',
      'Canal Sur', 'CANAL SUR', 'canal sur', 'Telecinco', 'TELECINCO', 'telecinco',
      'Cuatro', 'CUATRO', 'cuatro', 'La Sexta', 'LA SEXTA', 'la sexta',
      'Antena 3', 'ANTENA 3', 'antena 3',
      'Telefe', 'TELEFE', 'telefe', 'Telefe Internacional', 'TELEFE INTERNACIONAL',
      'América TV', 'AMERICA TV', 'america tv', 'América TV Argentina',
      'Canal 13 Argentina', 'CANAL 13 ARGENTINA', 'canal 13 argentina',
      'El Trece', 'EL TRECE', 'el trece', 'Canal 9', 'CANAL 9', 'canal 9',
      'Canal 13 Chile', 'CANAL 13 CHILE', 'canal 13 chile',
      'Mega Chile', 'MEGA CHILE', 'mega chile',
      'Televisa', 'TELEVISA', 'televisa', 'Canal de las Estrellas',
      'TV Azteca', 'TV AZTECA', 'tv azteca',
      'Univisión', 'UNIVISIÓN', 'univisión', 'Univision',
      'Telemundo', 'TELEMUNDO', 'telemundo', 'Telemundo HD', 'telemundo hd',
      'NHK World', 'NHK WORLD', 'nhk world', 'NHK World HD', 'nhk world hd',
      'NHK Japan', 'NHK JAPAN', 'nhk japan',
      'CCTV', 'cctv', 'CGTN', 'cgtn', 'CGTN HD', 'cgtn hd',
      'Al Jazeera', 'AL JAZEERA', 'al jazeera', 'Al Jazeera HD', 'al jazeera hd',
      'TRT World', 'TRT WORLD', 'trt world', 'TRT World HD',
      'Russia Today', 'RUSSIA TODAY', 'russia today', 'RT', 'rt', 'RT HD',
      'i24 News', 'I24 NEWS', 'i24 news', 'i24 News HD',
      'India TV', 'INDIA TV', 'india tv', 'NDTV', 'ndtv',
      'Korea TV', 'KOREA TV', 'korea tv', 'KBS World', 'KBS WORLD', 'kbs world',
      'Arirang', 'ARIRANG', 'arirang', 'Arirang HD', 'arirang hd',
      'Deportes', 'DEPORTES', 'deportes', 'ESPN Deportes', 'Fox Deportes',
      'beIN Sports', 'BEIN SPORTS', 'bein sports', 'beIN Sports HD'
    ]
  },
  {
    id: 'cat_pluto',
    name: 'Pluto TV',
    keywords: [
      'pluto', 'pluto tv', 'Pluto TV Canal UOL', 'pluto tv investigação',
      'pluto tv junior', 'pluto tv netmovies', 'pluto tv bang bang',
      'pluto tv filmes aventura', 'pluto tv terror trash', 'pluto tv cine crime',
      'pluto tv cine inspiração', 'pluto tv cine sucessos', 'pluto tv filmes ação',
      'pluto tv cine terror', 'pluto tv cine drama', 'pluto tv cine família',
      'pluto tv cine romance', 'pluto tv cine comédia romântica',
      'pluto tv cine comédia', 'pluto tv cine clássicos',
      'pluto tv filmes nacionais', 'pluto tv ficção científica',
      'pluto tv adrenalina freezone', 'pluto tv kids', 'pluto tv desenhos clássicos',
      'pluto tv kids club', 'pluto tv cineminha',
      'Pluto TV', 'PLUTO TV', 'PlutoTV', 'PLUTOTV',
      'Pluto TV Filmes', 'PLUTO TV FILMES', 'pluto tv filmes',
      'Pluto TV Séries', 'PLUTO TV SÉRIES', 'pluto tv séries',
      'Pluto TV Ação', 'PLUTO TV AÇÃO', 'pluto tv ação',
      'Pluto TV Comédia', 'PLUTO TV COMÉDIA', 'pluto tv comédia',
      'Pluto TV Drama', 'PLUTO TV DRAMA', 'pluto tv drama',
      'Pluto TV Terror', 'PLUTO TV TERROR', 'pluto tv terror',
      'Pluto TV Romance', 'PLUTO TV ROMANCE', 'pluto tv romance',
      'Pluto TV Família', 'PLUTO TV FAMÍLIA', 'pluto tv família',
      'Pluto TV Clássicos', 'PLUTO TV CLÁSSICOS', 'pluto tv clássicos',
      'Pluto TV Nacionais', 'PLUTO TV NACIONAIS', 'pluto tv nacionais',
      'Pluto TV Kids', 'PLUTO TV KIDS', 'pluto tv kids',
      'Pluto TV Junior', 'PLUTO TV JUNIOR', 'pluto tv junior',
      'Pluto TV Desenhos', 'PLUTO TV DESENHOS', 'pluto tv desenhos',
      'Pluto TV Sci-Fi', 'PLUTO TV SCI-FI', 'pluto tv sci-fi',
      'Pluto TV Esportes', 'PLUTO TV ESPORTES', 'pluto tv esportes',
      'Pluto TV Notícias', 'PLUTO TV NOTÍCIAS', 'pluto tv notícias',
      'Pluto TV UOL', 'PLUTO TV UOL', 'pluto tv uol',
      'Pluto TV NetMovies', 'PLUTO TV NETMOVIES', 'pluto tv netmovies',
      'Pluto TV BangBang', 'PLUTO TV BANGBANG', 'pluto tv bangbang',
      'Pluto TV Adrenalina', 'PLUTO TV ADRENALINA', 'pluto tv adrenalina',
      'Pluto TV Cineminha', 'PLUTO TV CINEMINHA', 'pluto tv cineminha',
      'Pluto TV Investigação', 'PLUTO TV INVESTIGAÇÃO', 'pluto tv investigação',
      'Pluto TV Freezone', 'PLUTO TV FREEZONE', 'pluto tv freezone'
    ]
  },
  {
    id: 'cat_aberto',
    name: 'Canais Abertos',
    keywords: [
      'aberto', 'cultura', 'tve', 'redtv', 'brasil', 'canais | aberto', 'redetv',
      'tv são luís', 'imperial tv', 'rtn tv', 'tv ceará', 'tv diário', 'tve bahia',
      'TVE', 'tve rs', 'tv brasil es', 'tv gazeta', 'tv cultura', 'catve tv cultura',
      'elytv', 'esflix tv', 'tv evangelizar', 'tv guará', 'rns tv',
      'santa cruz web tv', 'tv novo tempo', 'olha tv', 'tv paraná turismo',
      'tv candidés', 'tv rbc', 'gogo play', 'bs tv', 'tv clássicos',
      'web tv clássicos', 'otaku sign tv', 'lasstv', 'br super tv',
      'tv aparecida', 'pbc tv', 'central tv', 'ulb tv', 'aw tv',
      'top mix tv', 'tvm pará',
      'rede vida', 'gln tv', 'tv grão pará', 'tv litoral', 'tv osório news',
      'tela viva tv', 'istv', 'rede família', 'nbt', 'ngt', 'canal 29',
      'xtreme tv', 'tv aracati', 'life channel brasil', 'tv diário do sertão',
      'sou tv', 'tv marajoara', 'rede brasil', 'vivax tv', 'tv brasil hits',
      'amazonsat', 'terra viva',
      'canal do boi', 'tv notícias agrícolas', 'agro canal', 'canal rural',
      'agromais', 'agro plus', 'tv brasil central', 'rede século 21', 'yeeaah',
      'conectv', 'tv a folha', 'astral tv', 'rede utv', 'cultura internacional',
      'caravana play', 'tv cidade verde', 'abc brasil', 'wtj tv minas', 'play tv',
      'ypê tv', 'rede sdp tv', 'seven tv', 'sptv', 'imperial tv',
      'tv mais família', 'tv fala litoral', 'canal ok tv', 'img tv',
      'tv cel', 'tv vianney', 'tv recanto da fé', 'tv imaculada',
      'canção nova', 'igreja universal', 'grjngo', 'web tv progresso',
      'vrt channel', 'tenda tv', 'gospel internacional', 'gospel music tv',
      'gospel cartoon', 'gostei gospel tv', 'gospel movies tv', 'rede gospel',
      'tv gospel', 'rede qdm', 'tv gramado', 'brazitv', 'tvc', 'tv união',
      'Gospel Movies', 'GOSPEL MOVIES', 'Gospel Movies TV', 'GOSPEL MOVIES TV',
      'Gospel Music TV', 'GOSPEL MUSIC TV', 'gospel music tv hd',
      'Rede Gospel', 'REDE GOSPEL', 'TV Gospel', 'TV GOSPEL',
      'Gospel Internacional', 'GOSPEL INTERNACIONAL',
      'tv vitória pe', 'tv sim', 'tv serra dourada', 'vitrine esportiva',
      'tv recon', 'tv paraense', 'tv da gente', 'o dia tv', 'catve 2',
      'tve ms', 'tve rs', 'rs news webtv', 'tv serra américa',
      'ministério infantil tv', 'rede minas', 'tv nbn', 'vclassic tv',
      'tv sonata', 'tv jornal', 'rede meio norte', 'tv mais brasil',
      'rede clone tv', 'tv japi', 'rede tv sul', 'rede sul', 'vila tv',
      'tv channel network', 'rede mundo da televisão', 'primer tv', 'tv chroma',
      'qtal channel', 'vv8 tv', 'web tv campeão de tudo', 'tvc brasil',
      'terceira via', 'tv rio preto', 'rede ibtv', 'tv visual', 'demais tv',
      'wtv brasil', 'canal smart', 'tv nostalgia', 'web tv boa nova', 'agitomax',
      'universo tv', 'combrasil', 'tv santa maria', 'tv sol comunidade',
      'igreja mundial',
      'tv cultura sp', 'tv cultura rj', 'tv cultura hd', 'futura hd',
      'tv brasil hd', 'tv senado hd', 'tv justiça hd', 'tv câmara hd',
      'rede tv hd', 'rede tv fhd', 'tv gazeta sp', 'tv gazeta hd', 'cnb tv',
      'tv band sp', 'tv band rj', 'tv band hd', 'rede tv!', 'rede tv', 'redtv!',
      'tv cultura 2', 'tv brasil 2', 'futura 2', 'canal brasil 2',
      'tv escola 2', 'tv senado 2', 'tv justiça 2', 'tv câmara 2',
      'TV Aparecida', 'TV APARECIDA', 'tv aparecida', 'TV Aparecida HD', 'tv aparecida hd',
      'Rede Vida', 'REDE VIDA', 'rede vida', 'Rede Vida HD', 'rede vida hd',
      'Canção Nova', 'CANÇÃO NOVA', 'canção nova', 'Canção Nova HD', 'canção nova hd',
      'Rede Família', 'REDE FAMÍLIA', 'rede família', 'Rede Família HD',
      'TV Escola', 'TV ESCOLA', 'tv escola', 'TV Escola HD', 'tv escola hd',
      'TV Brasil', 'TV BRASIL', 'tv brasil', 'TV Brasil HD', 'tv brasil hd',
      'TV Câmara', 'TV CÂMARA', 'tv câmara', 'TV Câmara HD', 'tv câmara hd',
      'TV Senado', 'TV SENADO', 'tv senado', 'TV Senado HD', 'tv senado hd',
      'TV Justiça', 'TV JUSTIÇA', 'tv justiça', 'TV Justiça HD', 'tv justiça hd',
      'Canal Gov', 'CANAL GOV', 'canal gov', 'Canal Gov HD', 'canal gov hd',
      'Rede Século 21', 'REDE SÉCULO 21', 'rede século 21',
      'NBT', 'nbt', 'NBT HD', 'nbt hd',
      'TV Record Rural', 'TV Novo Tempo', 'TV NOVO TEMPO', 'tv novo tempo',
      'Novo Tempo', 'NOVO TEMPO', 'novo tempo', 'Novo Tempo HD', 'novo tempo hd',
      'Igreja Universal', 'IGREJA UNIVERSAL', 'igreja universal',
      'Igreja Mundial', 'IGREJA MUNDIAL', 'igreja mundial',
      'Tenda TV', 'TENDA TV', 'tenda tv',
      'Terra Viva', 'TERRA VIVA', 'terra viva',
      'TV Marajoara', 'TV MARAJOARA', 'tv marajoara',
      'TV Grão Pará', 'TV GRÃO PARÁ', 'tv grão pará',
      'Rede Brasil', 'REDE BRASIL', 'rede brasil',
      'TV Litoral', 'TV LITORAL', 'tv litoral',
      'Rede União', 'REDE UNIÃO', 'rede união', 'TV União', 'TV UNIÃO',
      'Imperial TV', 'IMPERIAL TV', 'imperial tv',
      'RTN TV', 'RTN', 'rtn tv', 'rtn',
      'TV Candidés', 'TV CANDIDÉS', 'tv candidés',
      'BS TV', 'bs tv', 'BS TV HD', 'bs tv hd',
      'Play TV', 'PLAY TV', 'play tv',
      'Top Mix TV', 'TOP MIX TV', 'top mix tv',
      'Agro Canal', 'AGRO CANAL', 'agro canal', 'Agro Canal HD', 'agro canal hd',
      'Canal Rural', 'CANAL RURAL', 'canal rural', 'Canal Rural HD', 'canal rural hd',
      'Canal do Boi', 'CANAL DO BOI', 'canal do boi', 'Canal do Boi HD',
      'Agro+', 'AGRO+', 'agro+', 'AgroMais', 'AGROMAIS', 'agromais',
      'TV Notícias Agrícolas', 'tv notícias agrícolas',
      'Conectv', 'CONECTV', 'conectv',
      'Yeeaah', 'YEEAAH', 'yeeaah'
    ]
  },
  {
    id: 'cat_premium',
    name: 'Canais Premium & Pay-Per-View',
    keywords: [
      'premium', 'pay per view', 'ppv', 'canais | premium',
      'Premium', 'PREMIUM', 'Pay Per View', 'PAY PER VIEW', 'PPV', 'ppv',
      'Premiere PPV', 'PREMIERE PPV', 'premiere ppv',
      'Telecine Premium', 'TELECINE PREMIUM', 'telecine premium',
      'HBO Premium', 'HBO PREMIUM', 'hbo premium',
      'Canal+ Premium', 'CANAL+ PREMIUM', 'canal+ premium',
      'MAX HD', 'max hd', 'MAX FHD', 'max fhd', 'MAX 4K', 'max 4k',
      'Telecine Premium HD', 'TELECINE PREMIUM HD', 'telecine premium hd',
      'Telecine Action HD', 'TELECINE ACTION HD', 'telecine action hd',
      'Telecine Pipoca HD', 'TELECINE PIPOCA HD', 'telecine pipoca hd',
      'Telecine Fun HD', 'TELECINE FUN HD', 'telecine fun hd',
      'Telecine Touch HD', 'TELECINE TOUCH HD', 'telecine touch hd',
      'Telecine Cult HD', 'TELECINE CULT HD', 'telecine cult hd',
      'Globo Premium', 'GLOBO PREMIUM', 'globo premium',
      'SBT Premium', 'SBT PREMIUM', 'sbt premium',
      'Record Premium', 'RECORD PREMIUM', 'record premium',
      'Premiere 1 HD', 'Premiere 2 HD', 'Premiere 3 HD', 'Premiere 4 HD',
      'Premiere 5 HD', 'Premiere 6 HD', 'Premiere 7 HD', 'Premiere 8 HD',
      'premiere 1 hd', 'premiere 2 hd', 'premiere 3 hd', 'premiere 4 hd',
      'premiere 5 hd', 'premiere 6 hd', 'premiere 7 hd', 'premiere 8 hd',
      'PREMIERE 1 HD', 'PREMIERE 2 HD', 'PREMIERE 3 HD', 'PREMIERE 4 HD',
      'PREMIERE 5 HD', 'PREMIERE 6 HD', 'PREMIERE 7 HD', 'PREMIERE 8 HD',
      'Premiere 1 FHD', 'Premiere 2 FHD', 'Premiere 3 FHD', 'Premiere 4 FHD',
      'premiere 1 fhd', 'premiere 2 fhd', 'premiere 3 fhd', 'premiere 4 fhd',
      'PREMIERE 1 FHD', 'PREMIERE 2 FHD', 'PREMIERE 3 FHD', 'PREMIERE 4 FHD',
      'Premiere 1 4K', 'Premiere 2 4K', 'premiere 1 4k', 'premiere 2 4k',
      'Premiere FC HD', 'PREMIERE FC HD', 'premiere fc hd',
      'Premiere Clubes HD', 'PREMIERE CLUBES HD', 'premiere clubes hd',
      'Combate HD', 'COMBATE HD', 'combate hd',
      'Combate FHD', 'COMBATE FHD', 'combate fhd',
      'Combate 4K', 'COMBATE 4K', 'combate 4k'
    ]
  },
  {
    id: 'cat_religioso',
    name: 'Religioso & Gospel',
    keywords: [
      'gospel', 'religioso', 'religion', 'cristão', 'cristao', 'evangelical',
      'igreja', 'canção nova', 'rede vida', 'aparecida', 'evangelizar',
      'canais | gospel', 'canais | religioso',
      'Gospel', 'GOSPEL', 'Religioso', 'RELIGIOSO', 'Cristão', 'CRISTÃO',
      'Gospel Movies', 'GOSPEL MOVIES', 'gospel movies', 'Gospel Movies TV', 'GOSPEL MOVIES TV',
      'Gospel Music TV', 'GOSPEL MUSIC TV', 'gospel music tv', 'Gospel Music TV HD',
      'Rede Gospel', 'REDE GOSPEL', 'rede gospel', 'Rede Gospel HD', 'REDE GOSPEL HD',
      'TV Gospel', 'TV GOSPEL', 'tv gospel', 'TV Gospel HD', 'TV GOSPEL HD',
      'Gospel Internacional', 'GOSPEL INTERNACIONAL', 'gospel internacional',
      'Gospel Internacional HD', 'GOSPEL INTERNACIONAL HD', 'gospel internacional hd',
      'Gospel Cartoon', 'GOSPEL CARTOON', 'gospel cartoon',
      'Gostei Gospel TV', 'GOSTEI GOSPEL TV', 'gostei gospel tv',
      'Canção Nova', 'CANÇÃO NOVA', 'canção nova', 'Canção Nova HD', 'canção nova hd',
      'Rede Vida', 'REDE VIDA', 'rede vida', 'Rede Vida HD', 'rede vida hd',
      'TV Aparecida', 'TV APARECIDA', 'tv aparecida', 'TV Aparecida HD',
      'TV Evangelizar', 'TV EVANGELIZAR', 'tv evangelizar', 'TV Evangelizar HD',
      'Igreja Universal', 'IGREJA UNIVERSAL', 'igreja universal',
      'Igreja Mundial', 'IGREJA MUNDIAL', 'igreja mundial',
      'Igreja Mundial HD', 'IGREJA MUNDIAL HD', 'igreja mundial hd',
      'Tenda TV', 'TENDA TV', 'tenda tv', 'Tenda TV HD', 'tenda tv hd',
      'Rede QDM', 'REDE QDM', 'rede qdm', 'Rede QDM HD', 'rede qdm hd',
      'Ministério Infantil TV', 'MINISTÉRIO INFANTIL TV', 'ministério infantil tv',
      'Novo Tempo', 'NOVO TEMPO', 'novo tempo', 'Novo Tempo HD', 'novo tempo hd',
      'TV Novo Tempo', 'TV NOVO TEMPO', 'tv novo tempo',
      'GospelPlay', 'GOSPELPLAY', 'gospelplay',
      'CNB TV', 'cnb tv', 'CNB', 'cnb',
      'Rede Família', 'REDE FAMÍLIA', 'rede família', 'Rede Família HD',
      'Canal da Família', 'CANAL DA FAMÍLIA', 'canal da família',
      'NBT', 'nbt', 'NBT HD', 'nbt hd',
      'TV Recanto da Fé', 'TV RECANTO DA FÉ', 'tv recanto da fé',
      'TV Imaculada', 'TV IMACULADA', 'tv imaculada',
      'TV Vianney', 'TV VIANNEY', 'tv vianney',
      'TV Record Gospel', 'tv record gospel',
      'Gln TV', 'GLN TV', 'gln tv',
      'Vida Cristã', 'VIDA CRISTÃ', 'vida cristã', 'Vida Cristã HD'
    ]
  },
  {
    id: 'cat_4k',
    name: 'Canais 4K & UHD',
    keywords: [
      '4k', 'uhd', '4K', 'UHD', '4k hdr', 'uhd hdr', '4K HDR', 'UHD HDR',
      'canais | 4k', 'canais | uhd',
      'Globo 4K', 'GLOBO 4K', 'globo 4k',
      'Record 4K', 'RECORD 4K', 'record 4k',
      'SBT 4K', 'SBT 4K', 'sbt 4k',
      'Band 4K', 'BAND 4K', 'band 4k',
      'Premiere 4K', 'PREMIERE 4K', 'premiere 4k',
      'SporTV 4K', 'SPORTV 4K', 'sportv 4k',
      'ESPN 4K', 'ESPN 4K', 'espn 4k',
      'Telecine 4K', 'TELECINE 4K', 'telecine 4k',
      'HBO 4K', 'HBO 4K', 'hbo 4k', 'HBO Max 4K', 'hbo max 4k',
      'MAX 4K', 'max 4k',
      'Discovery 4K', 'DISCOVERY 4K', 'discovery 4k',
      'National Geographic 4K', 'NAT GEO 4K', 'nat geo 4k',
      'History 4K', 'HISTORY 4K', 'history 4k',
      'Disney 4K', 'DISNEY 4K', 'disney 4k',
      'Nick 4K', 'NICK 4K', 'nick 4k',
      'Fox Sports 4K', 'FOX SPORTS 4K', 'fox sports 4k',
      'Combate 4K', 'COMBATE 4K', 'combate 4k',
      'RedeTV 4K', 'REDETV 4K', 'redetv 4k',
      'GNT 4K', 'GNT 4K', 'gnt 4k',
      'MTV 4K', 'MTV 4K', 'mtv 4k',
      'Multishow 4K', 'MULTISHOW 4K', 'multishow 4k',
      'TNT 4K', 'TNT 4K', 'tnt 4k',
      'Space 4K', 'SPACE 4K', 'space 4k',
      'AMC 4K', 'AMC 4K', 'amc 4k',
      'Paramount 4K', 'PARAMOUNT 4K', 'paramount 4k',
      'Universal 4K', 'UNIVERSAL 4K', 'universal 4k',
      'Megapix 4K', 'MEGAPIX 4K', 'megapix 4k',
      'Cartoon Network 4K', 'CARTOON NETWORK 4K', 'cartoon network 4k',
      'BandSports 4K', 'BANDSPORTS 4K', 'bandsports 4k',
      'ESPN Brasil 4K', 'ESPN BRASIL 4K', 'espn brasil 4k',
      '4K UHD', '4K HDR', '4K Dolby', '4k uhd', '4k hdr', '4k dolby',
      'Ultra HD', 'ULTRA HD', 'ultra hd', 'UltraHD', 'ULTRAHD'
    ]
  }
];

const manifest = {
  id: 'com.iptv.brasil.addon',
  version: '4.0.0',
  name: 'IPTV Brasil Pro',
  description: '🇧🇷 O melhor addon IPTV brasileiro para Stremio e Nuvio!\n\n📺 Mais de 2000 canais organizados em 20 categorias:\n• Globo, Record, SBT, Band, RedeTV, CNT\n• SporTV, ESPN, Premiere, Combate\n• Filmes, Séries, Documentários, Novelas\n• Infantil, Animes, Música, Variedades\n• Notícias, Internacional, 4K UHD\n• Pluto TV, Gospel, Premium e muito mais!\n\n💰 Apoie o projeto: https://livepix.gg/willacris\n\n⭐ Desenvolvido com ❤️ para a comunidade brasileira',

  contactEmail: 'willacris023@proton.me',
  donationUrl: 'https://livepix.gg/willacris',

  resources: ['catalog', 'stream', 'meta'],
  types: ['tv'],

  catalogs: CATEGORIES.map(cat => ({
    type: 'tv',
    id: cat.id,
    name: cat.name,
    extra: [
      { name: 'search', isRequired: false },
      { name: 'genre', isRequired: false, options: ['IPTV'] }
    ]
  })),

  idPrefixes: ['iptv_'],

  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1200px-Flag_of_Brazil.svg.png',
  background: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',

  behaviorHints: {
    adult: false,
    p2p: false,
    configurable: false,
    configurationRequired: false
  }
};

const builder = new addonBuilder(manifest);

let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 300000; // 5 minutos

async function loadM3U() {
  const now = Date.now();
  if (cache && (now - cacheTime < CACHE_DURATION)) {
    console.log(`📋 IPTV Brasil Pro: usando cache (${cache.length} canais)`);
    return cache;
  }

  try {
    console.log('🔄 IPTV Brasil Pro: carregando lista de canais...');
    const res = await axios.get(M3U_URL, {
      timeout: 30000,
      headers: { 'User-Agent': 'IPTV-Brasil-Addon/4.0.0' }
    });

    const lines = res.data.split('\n');
    const items = [];
    const logoRegex = /tvg-logo="([^"]+)"/;
    const groupRegex = /group-title="([^"]+)"/;
    const seenUrls = new Set(); // Deduplicação por URL

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF:')) {
        const logoMatch = line.match(logoRegex);
        const groupMatch = line.match(groupRegex);
        const logo = logoMatch ? logoMatch[1] : 'https://img.icons8.com/color/480/tv.png';
        const group = groupMatch ? groupMatch[1] : 'Canais Abertos';

        const name = line.substring(line.indexOf(',') + 1).trim();
        const url = (lines[i + 1] || '').trim();

        if (url && name && name.length > 0 && !seenUrls.has(url)) {
          const supportedProtocols = [
            'http://', 'https://', 'rtmp://', 'rtmps://',
            'rtsp://', 'udp://', 'rtp://', 'mms://', 'mmsh://', 'mmst://'
          ];

          const hasValidProtocol = supportedProtocols.some(p => url.toLowerCase().startsWith(p));

          if (hasValidProtocol) {
            const invalidExtensions = [
              '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp',
              '.txt', '.html', '.htm', '.xml', '.json',
              '.zip', '.rar', '.7z', '.tar', '.gz',
              '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv'
            ];

            const urlLower = url.toLowerCase();
            const isInvalidFile = invalidExtensions.some(ext => urlLower.endsWith(ext));

            if (!isInvalidFile) {
              seenUrls.add(url);
              items.push({
                id: 'iptv_' + Buffer.from(url).toString('base64').slice(0, 32),
                name: name.replace(/🔴/g, '').replace(/🟢/g, '').replace(/⚫/g, '').trim(),
                logo,
                group,
                url
              });
              i++;
            }
          }
        }
      }
    }

    cache = items;
    cacheTime = now;
    console.log(`✅ IPTV Brasil Pro: ${items.length} canais carregados com sucesso!`);
    return items;

  } catch (error) {
    console.error('❌ Erro ao carregar M3U:', error.message);
    if (cache && cache.length > 0) {
      console.log(`⚠️  Usando cache anterior (${cache.length} canais)`);
      return cache;
    }
    console.log('📭 Retornando lista vazia devido ao erro');
    return [];
  }
}

builder.defineCatalogHandler(async ({ id, extra }) => {
  try {
    const items = await loadM3U();
    const category = CATEGORIES.find(c => c.id === id);

    if (!category) {
      console.log(`⚠️  Categoria não encontrada: ${id}`);
      return { metas: [] };
    }

    // Suporte a busca por nome
    const searchQuery = extra && extra.search ? extra.search.toLowerCase() : null;

    const metas = items
      .filter(ch => {
        const groupLower = ch.group.toLowerCase();
        const nameLower = ch.name.toLowerCase();

        // Filtro de categoria
        const matchesCategory = category.keywords.some(keyword =>
          groupLower.includes(keyword.toLowerCase()) ||
          nameLower.includes(keyword.toLowerCase())
        );

        if (!matchesCategory) return false;

        // Filtro de busca adicional
        if (searchQuery) {
          return nameLower.includes(searchQuery) || groupLower.includes(searchQuery);
        }

        return true;
      })
      .map(ch => ({
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${ch.group}`,
        genres: ['IPTV'],
        releaseInfo: 'Ao Vivo'
      }));

    console.log(`📺 Categoria "${category.name}": ${metas.length} canais encontrados`);
    return { metas };

  } catch (error) {
    console.error(`❌ Erro no catalog handler:`, error.message);
    return { metas: [] };
  }
});

builder.defineMetaHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const ch = items.find(x => x.id === id);

    if (!ch) throw new Error(`Canal não encontrado: ${id}`);

    return {
      meta: {
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        background: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${ch.group}\n\n🇧🇷 Canal brasileiro disponível 24 horas por dia.\n\n⚡ Qualidade de transmissão ao vivo.\n\n🔥 IPTV Brasil Pro v4.0.0`,
        genres: ['IPTV'],
        releaseInfo: 'Ao Vivo',
        website: 'https://github.com/WillAcris/IPTV-BR'
      }
    };
  } catch (error) {
    console.error(`❌ Erro no meta handler:`, error.message);
    throw error;
  }
});

builder.defineStreamHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const ch = items.find(x => x.id === id);

    if (!ch) throw new Error(`Stream não encontrado: ${id}`);

    console.log(`🎬 Stream solicitado: ${ch.name} (${ch.group})`);

    return {
      streams: [
        {
          name: '📺 IPTV Brasil Pro',
          title: `${ch.name}\n${ch.group} • Ao Vivo`,
          url: ch.url,
          behaviorHints: {
            notWebReady: true,
            bingeGroup: `iptv-${ch.group.toLowerCase().replace(/\s+/g, '-')}`
          }
        }
      ]
    };
  } catch (error) {
    console.error(`❌ Erro no stream handler:`, error.message);
    throw error;
  }
});

const port = process.env.PORT || 7000;

serveHTTP(builder.getInterface(), { port })
  .then(() => {
    console.log('🚀 ============================================');
    console.log('🇧🇷  IPTV Brasil Pro Addon v4.0.0');
    console.log('🚀 ============================================');
    console.log(`📡 Servidor rodando na porta: ${port}`);
    console.log(`🌐 Manifest: http://localhost:${port}/manifest.json`);
    console.log(`📂 Categorias: ${CATEGORIES.length}`);
    console.log('');
    CATEGORIES.forEach(c => console.log(`   • ${c.name}`));
    console.log('');
    console.log('✨ Addon pronto para uso no Stremio e Nuvio!');
    console.log('💰 Apoie: https://livepix.gg/willacris');
    console.log('🚀 ============================================');

    loadM3U()
      .then(items => console.log(`✅ Cache inicial: ${items.length} canais carregados!`))
      .catch(err => console.error('⚠️  Erro no carregamento inicial:', err.message));
  })
  .catch(err => {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  });

process.on('uncaughtException', (err) => {
  console.error('❌ Erro não capturado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Promise rejeitada:', err);
});
