'use client'
import { useActionState } from 'react'
import { requestClass, type RequestState } from '../class-actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
export function RequestClassForm({classId}:{classId:string}){const [state,action,pending]=useActionState(requestClass,{} as RequestState); return <form action={action} className="space-y-2"><input type="hidden" name="classId" value={classId}/><Textarea name="message" placeholder="Message to Admin (optional)" rows={2}/>{state.error&&<p className="text-sm text-destructive">{state.error}</p>}{state.success&&<p className="text-sm text-emerald-600">{state.success}</p>}<Button disabled={pending}>{pending?'Requesting...':'Request class'}</Button></form>}
