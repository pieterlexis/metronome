SUBDIRS = src/yahttp/yahttp

-include sysdeps/$(shell uname).inc
VERSION=0.1

CXXFLAGS=-Wall -O3 -ggdb -I src/ -I src/yahttp/yahttp  -pthread -MMD -MP -DYAHTTP_MAX_URL_LENGTH=16383 $(CXX2011FLAGS) # -Wno-unused-local-typedefs 

CFLAGS=-Wall -I.  -O3 -MMD -MP
LDFLAGS+=$(CXX2011FLAGS) -pthread  $(STATICFLAGS)

CHEAT_ARG := $(shell ./update-git-hash-if-necessary)

SHIPPROGRAMS=metronome msubmit

all: $(SHIPPROGRAMS)

-include *.d

.PHONY:	check

src/%.o: src/%.cc
	$(CXX) $(CXXFLAGS) $< -o $@

src/yahttp/yahttp/libyahttp.la:
	$(MAKE) -C src/yahttp/yahttp

metronome: src/yahttp/yahttp/libyahttp.la src/iputils.o src/statstorage.o src/interpolate.o
	$(CC) $^ $(LDFLAGS) -o $@

msubmit: msubmit.o iputils.o
	$(CC) $^ $(LDFLAGS) -o $@

mmanage: mmanage.o statstorage.o
	$(CC) $^ $(LDFLAGS) -o $@

install: metronome
	mkdir -p $(DESTDIR)/usr/bin/
	mkdir -p $(DESTDIR)/usr/share/doc/metronome
	install -s $(SHIPPROGRAMS) $(DESTDIR)/usr/bin/

clean:
	rm -f *~ src/*.o src/*.d $(PROGRAMS) githash.h 
	$(MAKE) -C src/yahttp/yahttp clean

package: all
	rm -rf dist
	DESTDIR=dist make install
	fpm -s dir -f -t rpm -n metronome -v 1.g$(shell cat githash) -C dist .
	fpm -s dir -f -t deb -n metronome -v 1.g$(shell cat githash) -C dist .	
	rm -rf dist

codedocs: codedocs/html/index.html

codedocs/html/index.html: 	
	doxygen

check: testrunner
	./testrunner

testrunner: testrunner.o test-statstorage.o statstorage.o
	$(CXX) $^ -lboost_unit_test_framework -o $@ 
