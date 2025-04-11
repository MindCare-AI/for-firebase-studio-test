"use client";

import React from "react";
import { Platform, View, Image, Text, StyleSheet } from "react-native";
import clsx from "clsx";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  // Additional native props:
  nativeSource?: { uri: string } | number; 
  fallback?: string;
  style?: any;
  className?: string;
  isGroup?: boolean;
  groupMembers?: {
    uri: string | undefined;
    initials: string;
  }[];
}

export const Avatar = React.forwardRef<any, AvatarProps>(({ fallback, className, style, isGroup, groupMembers, ...rest }, ref) => {
  const renderAvatars = () => {
    if (isGroup && groupMembers && groupMembers.length > 0) {
      return (
        <View style={styles.groupAvatars}>
          {groupMembers.slice(0, 3).map((member, index) => (
            <View key={index} style={[styles.groupAvatarContainer, { left: index * 15 }]}>
              {member.uri ? (
                <AvatarPrimitive.Image
                  src={member.uri}
                  alt={member.initials}
                  className={clsx("h-8 w-8 rounded-full object-cover")}
                />
              ) : (
                <AvatarPrimitive.Fallback className={clsx("h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium")}>
                  {member.initials}
                </AvatarPrimitive.Fallback>
              )}
            </View>
          ))}
          {groupMembers.length > 3 && (
            <View style={[styles.groupAvatarContainer, { left: 3 * 15 }]}>
              <AvatarPrimitive.Fallback className={clsx("h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium")}>
                +{groupMembers.length - 3}
              </AvatarPrimitive.Fallback>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <>
          {fallback ? (
            <AvatarPrimitive.Fallback className={clsx("h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium")}>
              {fallback}
            </AvatarPrimitive.Fallback>
          ) : null}
        </>
      );
    }
  };

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={clsx("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      style={style}
      {...rest}
    >
      {renderAvatars()}
    </AvatarPrimitive.Root>
  );
});
Avatar.displayName = "Avatar";

export interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {}

export const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      className={clsx("aspect-square h-full w-full rounded-full object-cover", className)}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

const styles = StyleSheet.create({
  groupAvatars: {
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  groupAvatarContainer: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 100,
    overflow: 'hidden',
  },
  singleAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
});
