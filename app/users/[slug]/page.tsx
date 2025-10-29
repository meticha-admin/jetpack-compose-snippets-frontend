"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/profileSlice";
import { fetchSnippetsByUser } from "@/store/slices/snippetsSlice";
import { RootState } from "@/store/store";
import { Heart, Code, Star, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const profileProfilePage = () => {
  const dispatch = useAppDispatch();
  const {
    profile,
    loading: userIsLoading,
    error: userError,
  } = useAppSelector((s) => s.profiles);
  const { snippets, loading, error } = useAppSelector((s) => s.snippets);
  const params = useParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        dispatch(fetchProfile(params.slug as string));
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    const fetchSnippets = async () => {
      try {
        dispatch(fetchSnippetsByUser(params.slug as string));
      } catch (error) {
        console.error("Failed to fetch snippets:", error);
      }
    };

    if (params.slug) {
      fetchUserProfile();
      fetchSnippets();
    }
  }, [params.slug]);

 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader
          className="relative h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.coverPhoto})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative flex items-center space-x-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback>{profile.username}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
              <p className="text-gray-300">@{profile.profilename}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="text-center">
                <p className="font-bold text-xl">{profile.followers}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl">{profile.following}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl">{snippets.length}</p>
                <p className="font-bold text-xl">{snippets.length}</p>
                <p className="text-sm text-gray-500">Snippets</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button>Follow</Button>
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h2 className="text-lg font-semibold">About Me</h2>
            <p className="text-gray-600 mt-2">{profile.bio}</p>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Badges</h2>
            <div className="flex space-x-2 mt-2">
              {/* {profile.badges.map((badge) => (
                <Badge key={badge.name} variant="secondary">
                  {badge.name}
                </Badge>
              ))} */}
            </div>
          </div>
          <div className="mt-6">
            <Tabs defaultValue="snippets">
              <TabsList>
                <TabsTrigger value="snippets">
                  <Code className="mr-2 h-4 w-4" />
                  Snippets
                </TabsTrigger>
                <TabsTrigger value="favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="starred">
                  <Star className="mr-2 h-4 w-4" />
                  Starred
                </TabsTrigger>
              </TabsList>
              <TabsContent value="snippets">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {snippets.map((snippet) => (
                    <Card key={snippet.id}>
                      <CardHeader>
                        <CardTitle>{snippet.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">
                          {snippet.description}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span>{snippet.likes}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4" />
                            <span>{snippet.stars}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="favorites">
                {/* Add favorite snippets here */}
              </TabsContent>
              <TabsContent value="starred">
                {/* Add starred snippets here */}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default profileProfilePage;
