import { useCallback, useEffect, useMemo, useState } from 'react'

const OVER_SCAN = 5

type VirtualListItem = {
  index: number
  size: number
  start: number
  end: number
  _ref?: Element | null
}

type VirtualListProps = {
  count: number
  overscan?: number
  gap?: number
}

type ContainerType = {
  _ref: Element | null
  height: number
}

export default function useVirtualList ({
  count,
  overscan = OVER_SCAN,
  gap = 0,
}: VirtualListProps) {
  const [container, setContainer] = useState<ContainerType>({
    _ref: null,
    height: 0,
  })
  const containerRef = useCallback((node: Element | null | undefined) => {
    if (node) {
      setContainer({
        height: node.getBoundingClientRect().height,
        _ref: node,
      })
    }
  }, [])
  const [virtualFrontSpace, setVirtualFrontSpace] = useState<Element | null>(null)
  const [virtualBackSpace, setVirtualBackSpace] = useState<Element | null>(null)
  const virtualFrontSpaceRef =  useCallback((node: Element | null | undefined) => {
    if (node){
      setVirtualFrontSpace(node)
      ;(node as HTMLElement).style.flexShrink = '0'
    }
  }, [])
  const virtualBackSpaceRef =  useCallback((node: Element | null | undefined) => {
    if (node) {
      setVirtualBackSpace(node)
      ;(node as HTMLElement).style.flexShrink = '0'
    }
  }, [])

  const [totalHeight, setTotalHeight] = useState(0)
  const defaultItems = useMemo(() => Array.from({ length: count }, (_, i) => ({
    index: i,
    size: 0,
    start: 0,
    end: 0,
    _ref: null,
  })), [count])
  const [items, setItems] = useState<VirtualListItem[]>(defaultItems)
  const [virtualItems, setVirtualItems] = useState<VirtualListItem[]>(defaultItems)

  const measureElement = useCallback((node: Element | null | undefined) => {
    if (!node) return
    const index = Number((node as HTMLElement).dataset.key)

    setItems((prevItems) => {
      const size = node.getBoundingClientRect().height
      const start = index === 0 ? 0 : prevItems[index - 1].end + gap
      const end = start + size
      const _ref = node

      const newItems = prevItems.map((item, i) => {
        if (i === index) return {
          index, size, start, end, _ref,
        }
        else return item
      })

      setTotalHeight(newItems.reduce((acc, item) => acc + item.size + gap, -gap))
      return newItems
    })
  }, [gap])

  useEffect(function updateVirtualItems () {
    const handleScroll = () => {
      if (!container._ref) return
      const offset = (container._ref as HTMLElement).scrollTop
      const start = Math.max(0, offset)
      const end = offset + container.height

      const newVirtualItems = items.filter((item) => {
        return item.end > start && item.start < end
      })

      if (newVirtualItems.length === 0) return

      const overScanedVirtualItems = items.slice(
        Math.max(0, newVirtualItems[0].index - overscan),
        Math.min(count, newVirtualItems[newVirtualItems.length - 1].index + 1 + overscan),
      )

      setVirtualItems(overScanedVirtualItems)
    }

    handleScroll()
    container._ref?.addEventListener('scroll', handleScroll)
    return () => {
      container._ref?.removeEventListener('scroll', handleScroll)
    }
  }, [items, count, overscan, container])

  useEffect(function updateVirtualSpace () {
    if (virtualItems.length === count) return
    if (!container._ref || !virtualFrontSpace || !virtualBackSpace) return

    if (virtualItems[0] && virtualItems[0]._ref) {
      const virtualFrontSpaceEl = virtualFrontSpace as HTMLElement
      const isFirst = virtualItems[0].index === 0;
      virtualFrontSpaceEl.style.height = isFirst ? `0px` : `${virtualItems[0].start}px`;
      virtualFrontSpaceEl.style.visibility = isFirst ? 'hidden' : 'visible';
    }

    if (virtualItems[virtualItems.length - 1] && virtualItems[virtualItems.length - 1]._ref) {
      const virtualBackSpaceEl = virtualBackSpace as HTMLElement
      const isLast = virtualItems[virtualItems.length - 1].index === count - 1;
      virtualBackSpaceEl.style.height = isLast ? `0px` : `${totalHeight - virtualItems[virtualItems.length - 1].end}px`
      virtualBackSpaceEl.style.visibility = isLast ? 'hidden' : 'visible';
    }
  }, [virtualItems, count, totalHeight, container, virtualFrontSpace, virtualBackSpace])

  return {
    containerRef,
    virtualFrontSpaceRef,
    virtualBackSpaceRef,
    measureElement,
    totalHeight,
    virtualItems,
  }
}

