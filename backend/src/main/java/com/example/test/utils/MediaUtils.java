package com.example.test.utils;

import java.util.*;
import java.util.stream.Collectors;

public class MediaUtils {

    public static UrlDiff diffUrls(List<String> oldUrls, List<String> newUrls) {
        Set<String> oldSet = oldUrls != null
                ? oldUrls.stream()
                        .map(url -> url.replace("http://localhost:8080/api/media", ""))
                        .collect(Collectors.toSet())
                : new HashSet<>();

        Set<String> newSet = newUrls != null
                ? newUrls.stream()
                        .map(url -> url.replace("http://localhost:8080/api/media", ""))
                        .collect(Collectors.toSet())
                : new HashSet<>();

        Set<String> added = new HashSet<>(newSet);
        added.removeAll(oldSet);

        Set<String> removed = new HashSet<>(oldSet);
        removed.removeAll(newSet);

        return new UrlDiff(new ArrayList<>(added), new ArrayList<>(removed));
    }

    public static class UrlDiff {
        private List<String> added;
        private List<String> removed;

        public UrlDiff(List<String> added, List<String> removed) {
            this.added = added;
            this.removed = removed;
        }

        public List<String> getAdded() {
            return added;
        }

        public List<String> getRemoved() {
            return removed;
        }
    }
}
