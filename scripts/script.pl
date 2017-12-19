my $mapping = {
    start   => sub {
        my $ComponentName = @_[0] ? @_[0] : 'ComponentName';
        return "import React from 'react';\n\nconst ${ComponentName} = () => (";
    },
    end => sub {
        my $ComponentName = @_[0] ? @_[0] : 'ComponentName';
        return "\n);\n\nexport default ${ComponentName};";
    }
};
my $fileName = @ARGV[0];
@ARGV[0] =~ s/.html.tt/.jsx/;
my $newFile = @ARGV[0];
open (my $fh, '<:encoding(UTF-8)', $fileName) or die "Error opening file ${fileName}";
open (my $fw, '>', $newFile) or die "Error creating new file $newFile";
print $fw $mapping->{start}->(@ARGV[1]);
while (my $line = <$fh>) {
    chomp $line;
    $line =~ s/(class)=/$1Name=/;
    $line =~ s/\[\%\sl(.+)\s\%\]/{it.L$1}/;
    $line =~ s/\'/\\'/g;
    $line =~ s/(url_for\()\\'(.+)\\'\)/$1'$2')/g;
    $line =~ s/\"/\'/g;
    $line =~ s/it.L\(\"(.+)\"/it.L('$1'/;
    $line =~ s/\'\[\% (request.url_for.+) \%\]\'/{$1}/;
    $line =~ s/request\.(url_for)/it.$1/;
    $line =~ s/(website_name)/it.$1/;
    print $fw $line;
}
print $fw $mapping->{end}->(@ARGV[1]);
close $fh;
close $fw;