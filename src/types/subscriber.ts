export interface Subscriber {
  email: string
  subscribedAt: string
  source: string
}

export interface SubscribeRequest {
  email: string
  source: string
}

export interface SubscribeResponse {
  success: boolean
  message: string
}
