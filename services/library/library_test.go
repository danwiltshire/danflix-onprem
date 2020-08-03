package library_test

import (
	"testing"

	"github.com/danwiltshire/danflix-onprem/services/library"
)

func TestWalkMatch(t *testing.T) {
	mediaItem, err := library.WalkMatch("../../media/converted", "*.nfo")
	if err != nil {
		t.Errorf("Received WalkMatch err: %v", err)
	}
	if len(mediaItem) < 1 {
		t.Errorf("mediaItem length: %v want: > 0", len(mediaItem))
	} else {
		t.Logf("mediaItem length: %v", len(mediaItem))
	}
}
