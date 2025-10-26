// API Service Layer for custom backend integration

export interface Snippet {
  id: string
  slug: string
  title: string
  description: string
  code: string
  previewImage: string
  previewVideo?: string
  tags: string[]
  author: {
    name: string
    avatar: string
    githubUrl?: string
  }
  createdAt: string
  updatedAt: string
  likes: number
  views: number
  featured: boolean
}

export interface SubmitSnippetData {
  title: string
  description: string
  gistUrl: string
  previewFile: File
  categoryIds: number[]
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  success: boolean
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.jetpack-snippets.com"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Snippets API
  async getSnippets(params?: {
    page?: number
    limit?: number
    tags?: string[]
    sort?: "newest" | "popular" | "featured"
    search?: string
  }): Promise<PaginatedResponse<Snippet>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.tags?.length) searchParams.append("tags", params.tags.join(","))
    if (params?.sort) searchParams.append("sort", params.sort)
    if (params?.search) searchParams.append("search", params.search)

    return this.request<PaginatedResponse<Snippet>>(`/snippets?${searchParams.toString()}`)
  }

  async getSnippetBySlug(slug: string): Promise<ApiResponse<Snippet>> {
    return this.request<ApiResponse<Snippet>>(`/snippets/${slug}`)
  }

  async getFeaturedSnippets(): Promise<ApiResponse<Snippet[]>> {
    return this.request<ApiResponse<Snippet[]>>("/snippets/featured")
  }

  async submitSnippet(data: SubmitSnippetData): Promise<ApiResponse<Snippet>> {
    return this.request<ApiResponse<Snippet>>("/snippets", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async likeSnippet(snippetId: string): Promise<ApiResponse<{ likes: number }>> {
    return this.request<ApiResponse<{ likes: number }>>(`/snippets/${snippetId}/like`, {
      method: "POST",
    })
  }

  async incrementViews(snippetId: string): Promise<void> {
    await this.request(`/snippets/${snippetId}/view`, {
      method: "POST",
    })
  }

  // Tags API
  async getTags(): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>("/tags")
  }

  // Stats API
  async getStats(): Promise<
    ApiResponse<{
      totalSnippets: number
      totalAuthors: number
      totalViews: number
    }>
  > {
    return this.request<
      ApiResponse<{
        totalSnippets: number
        totalAuthors: number
        totalViews: number
      }>
    >("/stats")
  }
}

export const apiService = new ApiService()

// Mock data for development
export const mockSnippets: Snippet[] = [
  {
    id: "1",
    slug: "animated-button",
    title: "Animated Button Component",
    description:
      "A beautiful animated button with ripple effect and smooth transitions perfect for modern Android apps.",
    code: `@Composable
fun AnimatedButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    var isPressed by remember { mutableStateOf(false) }
    
    Button(
        onClick = {
            isPressed = true
            onClick()
        },
        modifier = modifier
            .scale(if (isPressed) 0.95f else 1f)
            .animateContentSize(),
        colors = ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.primary
        )
    ) {
        Text(text = text)
    }
    
    LaunchedEffect(isPressed) {
        if (isPressed) {
            delay(100)
            isPressed = false
        }
    }
}`,
    previewImage: "/placeholder.svg?height=300&width=400",
    tags: ["Button", "Animation", "UI"],
    author: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      githubUrl: "https://github.com/alexchen",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    likes: 124,
    views: 1250,
    featured: true,
  },
  {
    id: "2",
    slug: "loading-shimmer",
    title: "Loading Shimmer Effect",
    description: "Create smooth loading placeholders with shimmer animation for better user experience.",
    code: `@Composable
fun ShimmerEffect(
    modifier: Modifier = Modifier
) {
    val shimmerColors = listOf(
        Color.LightGray.copy(alpha = 0.6f),
        Color.LightGray.copy(alpha = 0.2f),
        Color.LightGray.copy(alpha = 0.6f)
    )
    
    val transition = rememberInfiniteTransition()
    val translateAnim = transition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Restart
        )
    )
    
    val brush = Brush.linearGradient(
        colors = shimmerColors,
        start = Offset.Zero,
        end = Offset(x = translateAnim.value, y = translateAnim.value)
    )
    
    Box(
        modifier = modifier
            .background(brush)
            .fillMaxWidth()
    )
}`,
    previewImage: "/placeholder.svg?height=300&width=400",
    tags: ["Loading", "Animation", "UX"],
    author: {
      name: "Sarah Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      githubUrl: "https://github.com/sarahkim",
    },
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
    likes: 89,
    views: 890,
    featured: false,
  },
  {
    id: "3",
    slug: "custom-card",
    title: "Glassmorphism Card",
    description: "Modern glassmorphism card design with blur effects and subtle shadows.",
    code: `@Composable
fun GlassmorphismCard(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.1f)
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 8.dp
        ),
        border = BorderStroke(
            width = 1.dp,
            color = Color.White.copy(alpha = 0.2f)
        )
    ) {
        Box(
            modifier = Modifier
                .background(
                    Brush.linearGradient(
                        colors = listOf(
                            Color.White.copy(alpha = 0.1f),
                            Color.White.copy(alpha = 0.05f)
                        )
                    )
                )
                .padding(16.dp)
        ) {
            content()
        }
    }
}`,
    previewImage: "/placeholder.svg?height=300&width=400",
    tags: ["Card", "Design", "Modern"],
    author: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      githubUrl: "https://github.com/mikejohnson",
    },
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    likes: 156,
    views: 1680,
    featured: true,
  },
]

// Mock API functions for development
export const mockApiService = {
  async getSnippets(params?: any): Promise<PaginatedResponse<Snippet>> {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

    let filteredSnippets = [...mockSnippets]

    if (params?.tags?.length) {
      filteredSnippets = filteredSnippets.filter((snippet) => snippet.tags.some((tag) => params.tags.includes(tag)))
    }

    if (params?.search) {
      filteredSnippets = filteredSnippets.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(params.search.toLowerCase()) ||
          snippet.description.toLowerCase().includes(params.search.toLowerCase()),
      )
    }

    if (params?.sort === "popular") {
      filteredSnippets.sort((a, b) => b.likes - a.likes)
    } else if (params?.sort === "newest") {
      filteredSnippets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (params?.sort === "featured") {
      filteredSnippets = filteredSnippets.filter((snippet) => snippet.featured)
    }

    const page = params?.page || 1
    const limit = params?.limit || 12
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      data: filteredSnippets.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: filteredSnippets.length,
        totalPages: Math.ceil(filteredSnippets.length / limit),
      },
      success: true,
    }
  },

  async getSnippetBySlug(slug: string): Promise<ApiResponse<Snippet>> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const snippet = mockSnippets.find((s) => s.slug === slug)
    if (!snippet) {
      throw new Error("Snippet not found")
    }

    return {
      data: snippet,
      success: true,
    }
  },

  async getFeaturedSnippets(): Promise<ApiResponse<Snippet[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      data: mockSnippets.filter((snippet) => snippet.featured),
      success: true,
    }
  },

  async submitSnippet(data: SubmitSnippetData): Promise<ApiResponse<Snippet>> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newSnippet: Snippet = {
      id: Date.now().toString(),
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
      title: data.title,
      description: data.description,
      previewFile: data.previewFile,
      categoryIds: data.categoryIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      featured: false,
    }

    return {
      data: newSnippet,
      success: true,
      message: "Snippet submitted successfully!",
    }
  },

  async getTags(): Promise<ApiResponse<string[]>> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const allTags = mockSnippets.flatMap((snippet) => snippet.tags)
    const uniqueTags = [...new Set(allTags)]

    return {
      data: uniqueTags,
      success: true,
    }
  },

  async getStats(): Promise<
    ApiResponse<{
      totalSnippets: number
      totalAuthors: number
      totalViews: number
    }>
  > {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const totalViews = mockSnippets.reduce((sum, snippet) => sum + snippet.views, 0)
    const uniqueAuthors = new Set(mockSnippets.map((snippet) => snippet.author.name)).size

    return {
      data: {
        totalSnippets: mockSnippets.length,
        totalAuthors: uniqueAuthors,
        totalViews,
      },
      success: true,
    }
  },
}
