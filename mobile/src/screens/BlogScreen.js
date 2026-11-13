import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ShopContext } from '../context/ShopContext';

export default function BlogScreen() {
  const { blogs, likeBlog, theme, isDarkMode } = useContext(ShopContext);

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [likedArticles, setLikedArticles] = useState({});

  const handleLike = (articleId) => {
    setLikedArticles((prev) => ({ ...prev, [articleId]: !prev[articleId] }));
    likeBlog(articleId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.title, { color: theme.primaryText }]}>Art Gazette</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Curator essays, collector guides & studio insights
        </Text>
      </View>

      {/* Article List */}
      <FlatList
        data={blogs}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isLiked = !!likedArticles[item._id];
          return (
            <TouchableOpacity
              style={[styles.blogCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
              activeOpacity={0.9}
              onPress={() => setSelectedArticle(item)}
            >
              <Image source={{ uri: item.image }} style={styles.coverImage} resizeMode="cover" />
              <View style={styles.cardContent}>
                <View style={styles.metaRow}>
                  <Text style={[styles.author, { color: isDarkMode ? theme.accentBone : theme.orangeAccent }]}>
                    {item.author}
                  </Text>
                  <Text style={[styles.date, { color: theme.mutedText }]}>{item.date}</Text>
                </View>

                <Text style={[styles.blogTitle, { color: theme.primaryText }]}>{item.title}</Text>
                <Text style={[styles.blogDesc, { color: theme.secondaryText }]} numberOfLines={3}>
                  {item.description}
                </Text>

                <View style={[styles.cardFooter, { borderTopColor: theme.cardBorder }]}>
                  <TouchableOpacity
                    style={styles.likeBtn}
                    onPress={() => handleLike(item._id)}
                  >
                    <Ionicons
                      name={isLiked ? 'heart' : 'heart-outline'}
                      size={18}
                      color={isLiked ? '#E63946' : theme.secondaryText}
                    />
                    <Text style={[styles.likeCount, { color: isLiked ? '#E63946' : theme.secondaryText }]}>
                      {item.likes + (isLiked ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.readMoreRow}>
                    <Text style={[styles.readMoreText, { color: isDarkMode ? theme.accentBone : theme.primaryText }]}>
                      Read Full Story
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={isDarkMode ? theme.accentBone : theme.primaryText}
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <Modal animationType="slide" visible={!!selectedArticle} onRequestClose={() => setSelectedArticle(null)}>
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedArticle(null)}>
                <Ionicons name="arrow-back" size={24} color={theme.primaryText} />
              </TouchableOpacity>
              <Text style={[styles.modalHeaderTitle, { color: theme.primaryText }]}>Curatorial Essay</Text>
              <TouchableOpacity onPress={() => handleLike(selectedArticle._id)}>
                <Ionicons
                  name={likedArticles[selectedArticle._id] ? 'heart' : 'heart-outline'}
                  size={24}
                  color={likedArticles[selectedArticle._id] ? '#E63946' : theme.primaryText}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>
              <Image source={{ uri: selectedArticle.image }} style={styles.modalCover} resizeMode="cover" />

              <View style={styles.modalMetaRow}>
                <Text style={[styles.modalAuthor, { color: theme.goldAccent }]}>{selectedArticle.author}</Text>
                <Text style={[styles.modalDate, { color: theme.mutedText }]}>{selectedArticle.date}</Text>
              </View>

              <Text style={[styles.modalArticleTitle, { color: theme.primaryText }]}>
                {selectedArticle.title}
              </Text>

              <View style={[styles.quoteBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                <Text style={[styles.quoteText, { color: theme.secondaryText }]}>
                  "True artwork is not merely an object; it is an enduring conversation between the artist’s hand and the space it inhabits."
                </Text>
              </View>

              <Text style={[styles.articleParagraph, { color: theme.secondaryText }]}>
                {selectedArticle.description}
              </Text>

              <Text style={[styles.articleParagraph, { color: theme.secondaryText }]}>
                When acquiring authentic artworks, understanding the provenance and intention behind the brushstrokes or stone carving creates a deeper intimacy with the work. Contemporary collectors increasingly favor pieces that reflect visceral texture, natural mineral compositions, and timeless restraint.
              </Text>

              <Text style={[styles.articleParagraph, { color: theme.secondaryText }]}>
                Each piece showcased at Art & Art comes certified and cataloged directly in partnership with the creators, ensuring that both aesthetic prestige and asset provenance are impeccably preserved.
              </Text>

              <View style={{ height: 60 }} />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  blogCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: 190,
  },
  cardContent: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  author: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 11,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 8,
  },
  blogDesc: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalContent: {
    padding: 20,
  },
  modalCover: {
    width: '100%',
    height: 240,
    borderRadius: 14,
    marginBottom: 18,
  },
  modalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalAuthor: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  modalDate: {
    fontSize: 12,
  },
  modalArticleTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 16,
  },
  quoteBox: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    marginBottom: 18,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  articleParagraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 14,
  },
});
