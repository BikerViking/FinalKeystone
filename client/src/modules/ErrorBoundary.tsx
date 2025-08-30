import React from 'react'
export default class ErrorBoundary extends React.Component<{children: React.ReactNode},{hasError:boolean}>{ 
  constructor(props:any){ super(props); this.state={hasError:false} }
  static getDerivedStateFromError(){ return { hasError:true } }
  componentDidCatch(err:any, info:any){ console.error('UI ErrorBoundary', { err, info }) }
  render(){ if (this.state.hasError) return <div className="p-6 text-center">Something went wrong. Please refresh.</div>; return this.props.children as any }
}
