import { PropsWithChildren, useCallback, useState } from 'react'
import useWindowVirtualList from './useWindowVirtualList'

const LoremIpsums = [
  '제2항과 제3항의 처분에 대하여는 법원에 제소할 수 없다. 이 헌법은 1988년 2월 25일부터 시행한다. 다만, 이 헌법을 시행하기 위하여 필요한 법률의 제정·개정과 이 헌법에 의한 대통령 및 국회의원의 선거 기타 이 헌법시행에 관한 준비는 이 헌법시행 전에 할 수 있다. 행정각부의 장은 국무위원 중에서 국무총리의 제청으로 대통령이 임명한다. 공무원은 국민전체에 대한 봉사자이며, 국민에 대하여 책임을 진다. 모든 국민은 법률이 정하는 바에 의하여 국방의 의무를 진다. 제2항과 제3항의 처분에 대하여는 법원에 제소할 수 없다. 이 헌법은 1988년 2월 25일부터 시행한다. 다만, 이 헌법을 시행하기 위하여 필요한 법률의 제정·개정과 이 헌법에 의한 대통령 및 국회의원의 선거 기타 이 헌법시행에 관한 준비는 이 헌법시행 전에 할 수 있다. 행정각부의 장은 국무위원 중에서 국무총리의 제청으로 대통령이 임명한다. 공무원은 국민전체에 대한 봉사자이며, 국민에 대하여 책임을 진다. 모든 국민은 법률이 정하는 바에 의하여 국방의 의무를 진다.',
  '대통령은 제4항과 제5항의 규정에 의하여 확정된 법률을 지체없이 공포하여야 한다. 제5항에 의하여 법률이 확정된 후 또는 제4항에 의한 확정법률이 정부에 이송된 후 5일 이내에 대통령이 공포하지 아니할 때에는 국회의장이 이를 공포한다. 국가는 청원에 대하여 심사할 의무를 진다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다. 대통령은 국민의 보통·평등·직접·비밀선거에 의하여 선출한다. 민주평화통일자문회의의 조직·직무범위 기타 필요한 사항은 법률로 정한다.',
  '대통령이 임시회의 집회를 요구할 때에는 기간과 집회요구의 이유를 명시하여야 한다. 대통령은 필요하다고 인정할 때에는 외교·국방·통일 기타 국가안위에 관한 중요정책을 국민투표에 붙일 수 있다. 국가는 대외무역을 육성하며, 이를 규제·조정할 수 있다. 국가는 사회보장·사회복지의 증진에 노력할 의무를 진다. 이 헌법중 공무원의 임기 또는 중임제한에 관한 규정은 이 헌법에 의하여 그 공무원이 최초로 선출 또는 임명된 때로부터 적용한다. 국가안전보장회의의 조직·직무범위 기타 필요한 사항은 법률로 정한다. 모든 국민은 법 앞에 평등하다. 누구든지 성별·종교 또는 사회적 신분에 의하여 정치적·경제적·사회적·문화적 생활의 모든 영역에 있어서 차별을 받지 아니한다.',
  '국가는 농지에 관하여 경자유전의 원칙이 달성될 수 있도록 노력하여야 하며, 농지의 소작제도는 금지된다. 제2항과 제3항의 처분에 대하여는 법원에 제소할 수 없다. 모든 국민은 근로의 권리를 가진다. 국가는 사회적·경제적 방법으로 근로자의 고용의 증진과 적정임금의 보장에 노력하여야 하며, 법률이 정하는 바에 의하여 최저임금제를 시행하여야 한다. 대통령은 법률이 정하는 바에 의하여 훈장 기타의 영전을 수여한다. 대통령이 궐위되거나 사고로 인하여 직무를 수행할 수 없을 때에는 국무총리, 법률이 정한 국무위원의 순서로 그 권한을 대행한다. 국가는 노인과 청소년의 복지향상을 위한 정책을 실시할 의무를 진다. 국가는 농지에 관하여 경자유전의 원칙이 달성될 수 있도록 노력하여야 하며, 농지의 소작제도는 금지된다. 제2항과 제3항의 처분에 대하여는 법원에 제소할 수 없다. 모든 국민은 근로의 권리를 가진다. 국가는 사회적·경제적 방법으로 근로자의 고용의 증진과 적정임금의 보장에 노력하여야 하며, 법률이 정하는 바에 의하여 최저임금제를 시행하여야 한다. 대통령은 법률이 정하는 바에 의하여 훈장 기타의 영전을 수여한다. 대통령이 궐위되거나 사고로 인하여 직무를 수행할 수 없을 때에는 국무총리, 법률이 정한 국무위원의 순서로 그 권한을 대행한다. 국가는 노인과 청소년의 복지향상을 위한 정책을 실시할 의무를 진다.',
  '국토와 자원은 국가의 보호를 받으며, 국가는 그 균형있는 개발과 이용을 위하여 필요한 계획을 수립한다. 대통령의 선거에 관한 사항은 법률로 정한다. 모든 국민은 그 보호하는 자녀에게 적어도 초등교육과 법률이 정하는 교육을 받게 할 의무를 진다. 비상계엄이 선포된 때에는 법률이 정하는 바에 의하여 영장제도, 언론·출판·집회·결사의 자유, 정부나 법원의 권한에 관하여 특별한 조치를 할 수 있다. 국가는 균형있는 국민경제의 성장 및 안정과 적정한 소득의 분배를 유지하고, 시장의 지배와 경제력의 남용을 방지하며, 경제주체간의 조화를 통한 경제의 민주화를 위하여 경제에 관한 규제와 조정을 할 수 있다. 국토와 자원은 국가의 보호를 받으며, 국가는 그 균형있는 개발과 이용을 위하여 필요한 계획을 수립한다. 대통령의 선거에 관한 사항은 법률로 정한다. 모든 국민은 그 보호하는 자녀에게 적어도 초등교육과 법률이 정하는 교육을 받게 할 의무를 진다. 비상계엄이 선포된 때에는 법률이 정하는 바에 의하여 영장제도, 언론·출판·집회·결사의 자유, 정부나 법원의 권한에 관하여 특별한 조치를 할 수 있다. 국가는 균형있는 국민경제의 성장 및 안정과 적정한 소득의 분배를 유지하고, 시장의 지배와 경제력의 남용을 방지하며, 경제주체간의 조화를 통한 경제의 민주화를 위하여 경제에 관한 규제와 조정을 할 수 있다.',
  '헌법재판소는 법관의 자격을 가진 9인의 재판관으로 구성하며, 재판관은 대통령이 임명한다. 모든 국민은 법률이 정하는 바에 의하여 국방의 의무를 진다. 국토와 자원은 국가의 보호를 받으며, 국가는 그 균형있는 개발과 이용을 위하여 필요한 계획을 수립한다. 대통령은 필요하다고 인정할 때에는 외교·국방·통일 기타 국가안위에 관한 중요정책을 국민투표에 붙일 수 있다. 이 헌법은 1988년 2월 25일부터 시행한다. 다만, 이 헌법을 시행하기 위하여 필요한 법률의 제정·개정과 이 헌법에 의한 대통령 및 국회의원의 선거 기타 이 헌법시행에 관한 준비는 이 헌법시행 전에 할 수 있다. 중앙선거관리위원회는 대통령이 임명하는 3인, 국회에서 선출하는 3인과 대법원장이 지명하는 3인의 위원으로 구성한다. 위원장은 위원중에서 호선한다.',
  '모든 국민은 그 보호하는 자녀에게 적어도 초등교육과 법률이 정하는 교육을 받게 할 의무를 진다. 국무회의는 정부의 권한에 속하는 중요한 정책을 심의한다. 재판의 심리와 판결은 공개한다. 다만, 심리는 국가의 안전보장 또는 안녕질서를 방해하거나 선량한 풍속을 해할 염려가 있을 때에는 법원의 결정으로 공개하지 아니할 수 있다. 국가는 전통문화의 계승·발전과 민족문화의 창달에 노력하여야 한다. 정당은 법률이 정하는 바에 의하여 국가의 보호를 받으며, 국가는 법률이 정하는 바에 의하여 정당운영에 필요한 자금을 보조할 수 있다. 정부는 회계연도마다 예산안을 편성하여 회계연도 개시 90일전까지 국회에 제출하고, 국회는 회계연도 개시 30일전까지 이를 의결하여야 한다.',
  '대법원장과 대법관이 아닌 법관은 대법관회의의 동의를 얻어 대법원장이 임명한다. 형사피고인은 유죄의 판결이 확정될 때까지는 무죄로 추정된다. 대법원장은 국회의 동의를 얻어 대통령이 임명한다. 대통령이 제1항의 기간내에 공포나 재의의 요구를 하지 아니한 때에도 그 법률안은 법률로서 확정된다. 대통령은 전시·사변 또는 이에 준하는 국가비상사태에 있어서 병력으로써 군사상의 필요에 응하거나 공공의 안녕질서를 유지할 필요가 있을 때에는 법률이 정하는 바에 의하여 계엄을 선포할 수 있다. 정부는 회계연도마다 예산안을 편성하여 회계연도 개시 90일전까지 국회에 제출하고, 국회는 회계연도 개시 30일전까지 이를 의결하여야 한다 대법원장과 대법관이 아닌 법관은 대법관회의의 동의를 얻어 대법원장이 임명한다. 형사피고인은 유죄의 판결이 확정될 때까지는 무죄로 추정된다. 대법원장은 국회의 동의를 얻어 대통령이 임명한다. 대통령이 제1항의 기간내에 공포나 재의의 요구를 하지 아니한 때에도 그 법률안은 법률로서 확정된다. 대통령은 전시·사변 또는 이에 준하는 국가비상사태에 있어서 병력으로써 군사상의 필요에 응하거나 공공의 안녕질서를 유지할 필요가 있을 때에는 법률이 정하는 바에 의하여 계엄을 선포할 수 있다. 정부는 회계연도마다 예산안을 편성하여 회계연도 개시 90일전까지 국회에 제출하고, 국회는 회계연도 개시 30일전까지 이를 의결하여야 한다',
  '국채를 모집하거나 예산외에 국가의 부담이 될 계약을 체결하려 할 때에는 정부는 미리 국회의 의결을 얻어야 한다. 국회는 정부의 동의없이 정부가 제출한 지출예산 각항의 금액을 증가하거나 새 비목을 설치할 수 없다. 대통령은 제4항과 제5항의 규정에 의하여 확정된 법률을 지체없이 공포하여야 한다. 제5항에 의하여 법률이 확정된 후 또는 제4항에 의한 확정법률이 정부에 이송된 후 5일 이내에 대통령이 공포하지 아니할 때에는 국회의장이 이를 공포한다. 모든 국민은 소급입법에 의하여 참정권의 제한을 받거나 재산권을 박탈당하지 아니한다. 대한민국의 영토는 한반도와 그 부속도서로 한다. 법률은 특별한 규정이 없는 한 공포한 날로부터 20일을 경과함으로써 효력을 발생한다.',
  '선거에 관한 경비는 법률이 정하는 경우를 제외하고는 정당 또는 후보자에게 부담시킬 수 없다. 대통령은 조국의 평화적 통일을 위한 성실한 의무를 진다. 재판의 전심절차로서 행정심판을 할 수 있다. 행정심판의 절차는 법률로 정하되, 사법절차가 준용되어야 한다. 모든 국민은 법률이 정하는 바에 의하여 공무담임권을 가진다. 대법원장은 국회의 동의를 얻어 대통령이 임명한다. 국가는 사회보장·사회복지의 증진에 노력할 의무를 진다. 대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 국회나 그 위원회의 요구가 있을 때에는 국무총리·국무위원 또는 정부위원은 출석·답변하여야 하며, 국무총리 또는 국무위원이 출석요구를 받은 때에는 국무위원 또는 정부위원으로 하여금 출석·답변하게 할 수 있다.',
]

const mockData = Array.from({ length: 1000 }, (_, i) => i + LoremIpsums[i % LoremIpsums.length])

export default function WindowVirtualList () {
  const [newText, setNewText] = useState('')
  const [text, setText] = useState(mockData[0])
  const [list, setList] = useState(mockData)
  const [index, setIndex] = useState(0)

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setList(prev => [...prev.slice().sort(() => Math.random() - 0.5)])
  //   }, 2000)

  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [setList])

  return (
    <div>
      <h2>Window</h2>
      <div style={{ backgroundColor: '#eee', width: '300px', padding: '16px', margin: '10px' }}>
        <h3>Add new list item</h3>
        <textarea value={newText} onChange={e => setNewText(e.target.value)} />
        <button onClick={() => setList(prev => [newText, ...prev])}>add</button>
      </div>

      <div style={{ backgroundColor: '#eee', width: '300px', padding: '16px', margin: '10px' }}>
        <h3>Update Certain list item</h3>
        index: <input
          type='number'
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value))
            setText(list[Number(e.target.value)])
          }}
               />
        <br />
        <br />
        <textarea value={text} onChange={e => setText(e.target.value)} />
        <button onClick={() => setList((prev) => {
          const next = prev.slice()
          next[index] = text
          return next
        })}
        >update
        </button>
      </div>

      <List list={list} />
      {/* <NomalList list={list} /> */}
    </div>
  )
}

function List ({ list }: { list: typeof mockData }) {
  const {
    containerRef, measureElement, totalHeight, virtualItems, moveTo,
  } = useWindowVirtualList({ count: list.length, gap: 10 })
  const [hash, setHash] = useState<number>(0)

  return (
    <div>
      <div style={{ backgroundColor: '#eee', width: '300px', padding: '16px', margin: '10px' }}>
        <h3>Move to certain list item</h3>
        hash: <input type='number' value={hash} onChange={e => setHash(Number(e.target.value))} />
        <button onClick={() => {
          moveTo(item => item.index === hash)
        }}
        >move
        </button>
      </div>
      <div
        style={{
          width: '600px',
          overflow: 'auto',
          border: '1px solid black',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
        ref={containerRef}
      >
        <Logger position='left'>
          <div>totalHeight: {totalHeight}</div>
        </Logger>

        {
          virtualItems.map(({ size, start, end, index }) => (
            <div
              ref={measureElement}
              key={index}
              data-index={index}
              style={{
                border: '1px solid red',
                padding: '10px',
                position: 'relative',
                minHeight: '100px',
                backgroundColor: hash === index ? 'yellow' : 'white',
              }}
            >
              <Logger>
                <div>index: {index}</div>
                <div>size: {size}</div>
                <div>start: {start}</div>
                <div>end: {end}</div>
              </Logger>
              <h2>{index}.</h2>
              {list[index]}
            </div>
          ))
        }
      </div>
    </div>
  )
}

function Logger ({ children, position = 'right' }: PropsWithChildren & { position?: 'left' | 'right' }) {
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        top: 0,
        right: (position === 'right') ? 0 : undefined,
        left: (position === 'left') ? 0 : undefined,
        color: 'white',
        background: 'black',
        padding: '5px',
        zIndex: 100,
      }}
    >
      {children}
    </div>
  )
}

function NomalList ({ list }: { list: typeof mockData }) {
  const measureElement = useCallback((node: HTMLDivElement | null) => {
    console.log('measureElement', node)
  }, [])
  return (
    <div
      style={{
        width: '600px',
        overflow: 'auto',
        border: '1px solid black',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {list.map((text, index) => (
        <div
          key={index}
          ref={measureElement}
          style={{
            border: '1px solid red',
            padding: '10px',
            position: 'relative',
            minHeight: '100px',
          }}
        >
          <h2>{index}.</h2>
          {list[index]}
        </div>
      ))}
    </div>
  )
}
