export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      comments: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          participants: string[]
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participants: string[]
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participants?: string[]
        }
        Relationships: []
      }
      feed_posts: {
        Row: {
          content: string
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      listing_bids: {
        Row: {
          bid_amount: number
          bidder_id: string
          created_at: string | null
          id: string
          listing_id: string
        }
        Insert: {
          bid_amount: number
          bidder_id: string
          created_at?: string | null
          id?: string
          listing_id: string
        }
        Update: {
          bid_amount?: number
          bidder_id?: string
          created_at?: string | null
          id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_bids_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_offers: {
        Row: {
          buyer_id: string
          counter_offer_amount: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          listing_id: string
          message: string | null
          offer_amount: number | null
          seller_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          counter_offer_amount?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id: string
          message?: string | null
          offer_amount?: number | null
          seller_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          counter_offer_amount?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id?: string
          message?: string | null
          offer_amount?: number | null
          seller_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace: {
        Row: {
          created_at: string | null
          id: string
          price: number
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          price: number
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          price?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          allows_offers: boolean | null
          allows_trades: boolean | null
          auction_end_time: string | null
          bid_increment: number | null
          brand: string | null
          condition: string | null
          created_at: string | null
          current_bid: number | null
          description: string | null
          id: string
          image_urls: string[] | null
          listing_type: string
          minimum_offer: number | null
          preferred_trade_brands: string[] | null
          price: number | null
          status: string | null
          title: string
          trade_preferences: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allows_offers?: boolean | null
          allows_trades?: boolean | null
          auction_end_time?: string | null
          bid_increment?: number | null
          brand?: string | null
          condition?: string | null
          created_at?: string | null
          current_bid?: number | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          listing_type?: string
          minimum_offer?: number | null
          preferred_trade_brands?: string[] | null
          price?: number | null
          status?: string | null
          title: string
          trade_preferences?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allows_offers?: boolean | null
          allows_trades?: boolean | null
          auction_end_time?: string | null
          bid_increment?: number | null
          brand?: string | null
          condition?: string | null
          created_at?: string | null
          current_bid?: number | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          listing_type?: string
          minimum_offer?: number | null
          preferred_trade_brands?: string[] | null
          price?: number | null
          status?: string | null
          title?: string
          trade_preferences?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          listing_offer_id: string | null
          message_type: string | null
          receiver_id: string
          sender_id: string
          shared_listing_id: string | null
          trade_request_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          listing_offer_id?: string | null
          message_type?: string | null
          receiver_id: string
          sender_id: string
          shared_listing_id?: string | null
          trade_request_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          listing_offer_id?: string | null
          message_type?: string | null
          receiver_id?: string
          sender_id?: string
          shared_listing_id?: string | null
          trade_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_listing_offer_id_fkey"
            columns: ["listing_offer_id"]
            isOneToOne: false
            referencedRelation: "listing_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_shared_listing_id_fkey"
            columns: ["shared_listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_trade_request_id_fkey"
            columns: ["trade_request_id"]
            isOneToOne: false
            referencedRelation: "trade_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          buyer_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          listing_id: string
          message: string | null
          offer_amount: number
          seller_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id: string
          message?: string | null
          offer_amount: number
          seller_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          listing_id?: string
          message?: string | null
          offer_amount?: number
          seller_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plushies: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          post_id: string
          post_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id: string
          post_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          post_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          accepts_offers: boolean | null
          brand: string | null
          color: string | null
          condition: string | null
          content: string
          created_at: string | null
          delivery_cost: number | null
          delivery_method: string | null
          description: string | null
          filling: string | null
          for_sale: boolean | null
          id: string
          image: string | null
          listing_type: string | null
          material: string | null
          min_offer_amount: number | null
          offer_deadline: string | null
          price: number | null
          size: string | null
          species: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          accepts_offers?: boolean | null
          brand?: string | null
          color?: string | null
          condition?: string | null
          content: string
          created_at?: string | null
          delivery_cost?: number | null
          delivery_method?: string | null
          description?: string | null
          filling?: string | null
          for_sale?: boolean | null
          id?: string
          image?: string | null
          listing_type?: string | null
          material?: string | null
          min_offer_amount?: number | null
          offer_deadline?: string | null
          price?: number | null
          size?: string | null
          species?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          accepts_offers?: boolean | null
          brand?: string | null
          color?: string | null
          condition?: string | null
          content?: string
          created_at?: string | null
          delivery_cost?: number | null
          delivery_method?: string | null
          description?: string | null
          filling?: string | null
          for_sale?: boolean | null
          id?: string
          image?: string | null
          listing_type?: string | null
          material?: string | null
          min_offer_amount?: number | null
          offer_deadline?: string | null
          price?: number | null
          size?: string | null
          species?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          favorite_brands: string[] | null
          favorite_types: string[] | null
          full_name: string | null
          header_background_color: string | null
          header_background_image: string | null
          header_gradient_end: string | null
          header_gradient_start: string | null
          header_text_color: string | null
          hide_from_search: boolean | null
          id: number | null
          instagram: string | null
          is_private: boolean | null
          location: string | null
          new_release_alerts: boolean | null
          phone_number: string | null
          postal_code: string | null
          receive_email_updates: boolean | null
          receive_marketing_emails: boolean | null
          receive_wishlist_alerts: boolean | null
          show_activity_status: boolean | null
          show_collection: boolean | null
          show_wishlist: boolean | null
          state_province: string | null
          twitter: string | null
          updated_at: string | null
          user_id: number
          user_uuid: string
          website: string | null
          youtube: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          favorite_brands?: string[] | null
          favorite_types?: string[] | null
          full_name?: string | null
          header_background_color?: string | null
          header_background_image?: string | null
          header_gradient_end?: string | null
          header_gradient_start?: string | null
          header_text_color?: string | null
          hide_from_search?: boolean | null
          id?: number | null
          instagram?: string | null
          is_private?: boolean | null
          location?: string | null
          new_release_alerts?: boolean | null
          phone_number?: string | null
          postal_code?: string | null
          receive_email_updates?: boolean | null
          receive_marketing_emails?: boolean | null
          receive_wishlist_alerts?: boolean | null
          show_activity_status?: boolean | null
          show_collection?: boolean | null
          show_wishlist?: boolean | null
          state_province?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: number
          user_uuid: string
          website?: string | null
          youtube?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          favorite_brands?: string[] | null
          favorite_types?: string[] | null
          full_name?: string | null
          header_background_color?: string | null
          header_background_image?: string | null
          header_gradient_end?: string | null
          header_gradient_start?: string | null
          header_text_color?: string | null
          hide_from_search?: boolean | null
          id?: number | null
          instagram?: string | null
          is_private?: boolean | null
          location?: string | null
          new_release_alerts?: boolean | null
          phone_number?: string | null
          postal_code?: string | null
          receive_email_updates?: boolean | null
          receive_marketing_emails?: boolean | null
          receive_wishlist_alerts?: boolean | null
          show_activity_status?: boolean | null
          show_collection?: boolean | null
          show_wishlist?: boolean | null
          state_province?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: number
          user_uuid?: string
          website?: string | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: true
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          created_at: string
          id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trade_requests: {
        Row: {
          counter_offer_description: string | null
          created_at: string | null
          id: string
          message: string
          offered_items_description: string | null
          offered_listing_id: string | null
          requested_items_description: string | null
          requested_listing_id: string | null
          requester_id: string
          status: string | null
          target_user_id: string
          updated_at: string | null
        }
        Insert: {
          counter_offer_description?: string | null
          created_at?: string | null
          id?: string
          message: string
          offered_items_description?: string | null
          offered_listing_id?: string | null
          requested_items_description?: string | null
          requested_listing_id?: string | null
          requester_id: string
          status?: string | null
          target_user_id: string
          updated_at?: string | null
        }
        Update: {
          counter_offer_description?: string | null
          created_at?: string | null
          id?: string
          message?: string
          offered_items_description?: string | null
          offered_listing_id?: string | null
          requested_items_description?: string | null
          requested_listing_id?: string | null
          requester_id?: string
          status?: string | null
          target_user_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_requests_offered_listing_id_fkey"
            columns: ["offered_listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_requests_requested_listing_id_fkey"
            columns: ["requested_listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_requests_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_requests_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_description: string | null
          badge_name: string
          badge_type: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_description?: string | null
          badge_name: string
          badge_type: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_description?: string | null
          badge_name?: string
          badge_type?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reviews: {
        Row: {
          created_at: string | null
          id: string
          rating: number
          review_text: string | null
          reviewed_user_id: string
          reviewer_id: string
          transaction_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating: number
          review_text?: string | null
          reviewed_user_id: string
          reviewer_id: string
          transaction_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number
          review_text?: string | null
          reviewed_user_id?: string
          reviewer_id?: string
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_reviewed_user_id_fkey"
            columns: ["reviewed_user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reviews_reviewed_user_id_fkey"
            columns: ["reviewed_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "user_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          clerk_id: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          clerk_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          clerk_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_public_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_offer_with_notification: {
        Args: {
          p_buyer_id: string
          p_listing_id: string
          p_message?: string
          p_offer_amount: number
          p_seller_id: string
        }
        Returns: string
      }
      create_user_safe: {
        Args: { user_data: Json }
        Returns: {
          avatar_url: string
          clerk_id: string
          email: string
          first_name: string
          id: string
          last_name: string
          username: string
        }[]
      }
      log_security_event: {
        Args: { details?: Json; event_type: string; user_id: string }
        Returns: undefined
      }
      set_current_user_id: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      user_owns_listing: {
        Args: { listing_id_param: string }
        Returns: boolean
      }
      user_owns_post: {
        Args: { post_id_param: string }
        Returns: boolean
      }
      validate_and_sanitize_input: {
        Args: { allow_html?: boolean; input_text: string; max_length?: number }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
