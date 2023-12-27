### mac 如何安装 grpc

第一步：安装 `brew`，切记使用国内源

```js
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

安装好了之后再来下载`protobuf`

```js
brew install protobuf
```

安装完成之后可以使用 `protoc --version` 检查一下自己安装完成没，如果安装完成了，会输出对应的版本号

之后安装 `protoc-gen-go` 和 `protoc-gen-go-grpc`

```js
go install google.golang.org/protobuf/cmd/protoc-gen-go

go install google.golang.org/grpc/cmd/protoc-gen-go-grpc
```

安装完成了之后,`protoc-gen-go` 和 `protoc-gen-go-grpc` 这两个文件一般会被安装在`$GOPATH`下面，我们可以通过 `go env` 命令查看 `GOPATH`的地址，然后打开`GOPATH`地址，将`bin`目录下面的 `protoc-gen-go` 和 `protoc-gen-go-grpc` 这两个文件拷贝到 `/use/local/bin`下面就可以了，如下：

> 注：/usr/local/bin 是 Mac OS 系统中用于存放用户自行安装的可执行文件的目录。当您使用 make install 或者 ./configure && make && make install 等命令来安装某些软件时，它们通常会被安装到 /usr/local/bin 目录下。

```js
cp protoc-gen-go /usr/local/bin/

cp protoc-gen-go-grpc /usr/local/bin/
```

执行完以上的步骤基本上就可以去编译 `.proto`文件了

使用命令如下：

```js
 protoc -I. helloworld.proto --go_out=. --go-grpc_out=.
```
