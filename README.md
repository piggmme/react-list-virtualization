# React List Virtualization

## useVirtualList

`useVirtualList`은 스크롤 가능한 컨테이너 내부에서 긴 리스트의 스크롤 성능을 개선하고자 할 때 유용하다. containerRef는 외부 컨테이너에, virtualFrontSpaceRef와 virtualBackSpaceRef는 리스트 앞뒤의 여백에 연결하면 된다.

### 사용 방법

```tsx
  const {
    containerRef,
    measureElement,
    totalHeight,
    virtualItems,
    virtualFrontSpaceRef,
    virtualBackSpaceRef,
    moveTo,
  } = useVirtualList({ count: list.length, gap: 10 })

  return (
    <div
      style={{
        width: '600px',
        height: '600px',
        overflow: 'scroll',
        border: '1px solid blue',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
      ref={containerRef}
    >
      <div ref={virtualFrontSpaceRef}></div>
        {
          virtualItems.map(({ index, size, start, end }) => (
            <div
              ref={measureElement}
              key={index}
              data-key={index}
              style={{
                border: '1px solid red',
                padding: '10px',
                position: 'relative',
              }}
            >
              <h2>{index}.</h2>
              {list[index]}
            </div>
          ))
        }
      <div ref={virtualBackSpaceRef}></div>
    </div>
  )
```


## useWindowVirtualList

`useWindowVirtualList`은 스크롤이 발생하는 윈도우에서 긴 리스트의 스크롤 성능을 개선하고자 할 때 유용하다. 리스트 아이템이 많을 때 모든 아이템을 렌더링하지 않고, 화면에 보이는 아이템과 약간의 여분 아이템(overscan)만 렌더링하여 성능을 최적화한다.

### 사용 방법

```tsx
  const {
    containerRef, measureElement, totalHeight, virtualItems, moveTo,
  } = useWindowVirtualList({ count: list.length, gap: 10 })

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
      ref={containerRef}
    >
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
            }}
          >
            <h2>{index}.</h2>
            {list[index]}
          </div>
        ))
      }
    </div>
  )
```