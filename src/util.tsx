import { forwardRef, useImperativeHandle, useMemo, ForwardRefExoticComponent, useLayoutEffect } from 'react'
import { Vector2 } from 'three'
import { ReactThreeFiber } from 'react-three-fiber'
import { Effect, BlendFunction, BlendMode } from 'postprocessing'

export const toggleBlendMode = (effect: Effect, blendFunc: number, active: boolean) => {
  effect.blendMode = new BlendMode(active ? blendFunc : BlendFunction.SKIP)
}

export const wrapEffect = <
  EffectType extends Effect &
    Partial<{
      active: boolean
      blendFunction: number
    }>
>(
  effectImpl: new (...args: any[]) => EffectType,
  defaultBlendMode: number = BlendFunction.NORMAL
): ForwardRefExoticComponent<EffectType> => {
  return forwardRef(({ active = true, ...props }: ConstructorParameters<typeof effectImpl>[0] & EffectType, ref) => {
    const effect: Effect = useMemo(() => new effectImpl(props), [props])

    /*  useLayoutEffect(() => {
      toggleBlendMode(effect, props.blendFunction != null ? props.blendFunction : defaultBlendMode, active)
    }, [active]) */

    useImperativeHandle(ref, () => effect, [effect])

    return null
  })
}

export const useVector2 = (props: any, key: string): Vector2 => {
  const vec: ReactThreeFiber.Vector2 = props[key]

  return useMemo(() => {
    if (vec instanceof Vector2) {
      return new Vector2().set(vec.x, vec.y)
    } else if (Array.isArray(vec)) {
      const [x, y] = vec
      return new Vector2().set(x, y)
    }
  }, [props[key]])
}
