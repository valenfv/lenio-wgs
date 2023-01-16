import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('./RadialChart'), {
  ssr: false
})

export default () => <DynamicComponentWithNoSSR />